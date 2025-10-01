/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "@modelcontextprotocol/sdk/server";
import { ChromaClient } from "chromadb";
import axios from "axios";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { llmWithFallback } from "@/app/server/fallbackLLM/openRouter";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/** Env config */
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || "";
const CEREBRAS_URL = "https://api.cerebras.ai/v1";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "";
const LIVEKIT_URL = process.env.LIVEKIT_URL || "wss://your-livekit-server.com";

const CHROMA = new ChromaClient({ path: process.env.CHROMA_HOST || "http://localhost:8000" });
const COLLECTION_NAME = "document_embeddings";
let collection: any = null;

async function getCollection() {
  if (collection) return collection;
  collection = await CHROMA.getCollection({ name: COLLECTION_NAME });
  return collection;
}

async function generateSummary(
  text: string,
  summaryType: "brief" | "detailed" | "bullet-points" = "detailed"
): Promise<string> {
  let prompt = "";
  switch (summaryType) {
    case "brief":
      prompt = `Provide a brief summary (max 200 words):\n\n${text}`;
      break;
    case "bullet-points":
      prompt = `Summarize as bullet points (max 8):\n\n${text}`;
      break;
    default:
      prompt = `Provide a comprehensive summary (max 500 words):\n\n${text}`;
  }

  return llmWithFallback(prompt, async () => {
    const resp = await axios.post(
      `${CEREBRAS_URL}/chat/completions`,
      {
        model: "llama-4-turbo",
        messages: [
          { role: "system", content: "You are an expert summarizer." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.1
      },
      { headers: { Authorization: `Bearer ${CEREBRAS_API_KEY}` } }
    );
    return resp.data.choices[0].message.content;
  });
}

async function generateLiveKitToken(roomName: string, participant: string) {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participant,
    name: participant,
  });
  token.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });
  return token.toJwt();
}

async function generateTTSAudio(text: string): Promise<{ audioUrl: string }> {
  const response = await axios.post(
    "https://api.openai.com/v1/audio/speech",
    { model: "tts-1", input: text, voice: "alloy", response_format: "mp3" },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      responseType: "arraybuffer"
    }
  );
  const audioBuffer = Buffer.from(response.data);
  // upload to S3/Cloudinary etc. – mock URL for now
  return { audioUrl: "https://example.com/generated-audio.mp3" };
}

export async function summarizeDocument(documentId: string, summaryType: string, enableTTS: boolean, roomName?: string) {
  const chromaCollection = await getCollection();
  const results = await chromaCollection.get({ where: { documentId }, include: ["documents", "metadatas"] });
  if (!results.documents.length) throw new Error(`Document ${documentId} not found`);

  const fullText = results.documents.join("\n\n");
  const summary = await generateSummary(fullText, summaryType as any);

  let audioUrl: string | undefined;
  let liveKitToken: string | undefined;
  if (enableTTS && roomName) {
    const token = await generateLiveKitToken(roomName, `tts_${Date.now()}`);
    const ttsResult = await generateTTSAudio(summary);
    audioUrl = ttsResult.audioUrl;
    liveKitToken = token;
  }

  return { documentId, summary, summaryType, audioUrl, liveKitToken, chunksProcessed: results.documents.length };
}

export async function listDocuments() {
  const chromaCollection = await getCollection();
  const results = await chromaCollection.get({ include: ["metadatas"] });

  const docMap = new Map<string, { chunkCount: number; cloudinaryUrl?: string }>();
  for (const md of results.metadatas) {
    const docId = md?.documentId as string;
    const cloudUrl = md?.cloudinary_url as string;
    if (!docId) continue;
    if (docMap.has(docId)) docMap.get(docId)!.chunkCount++;
    else docMap.set(docId, { chunkCount: 1, cloudinaryUrl: cloudUrl });
  }

  return Array.from(docMap.entries()).map(([documentId, d]) => ({
    documentId,
    chunkCount: d.chunkCount,
    cloudinaryUrl: d.cloudinaryUrl
  }));
}

/**
 * MCP Server setup
 */
const server = new Server({ name: "summary-agent", version: "1.0.0" });

(server as any).tool("summarize", async (req: any) => {
  const { documentId, summaryType = "detailed", enableTTS = false, roomName } = req.params as any;
  const res = await summarizeDocument(documentId, summaryType, enableTTS, roomName);
  return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
});

(server as any).tool("listDocuments", async () => {
  const docs = await listDocuments();
  return { content: [{ type: "text", text: JSON.stringify(docs, null, 2) }] };
});

server.connect(new StdioServerTransport());
