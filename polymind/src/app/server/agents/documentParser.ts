/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ChromaClient, Collection } from "chromadb";
import pdf from "pdf-parse";
import fs from "fs";
import FormData from "form-data";
import { Client } from "@modelcontextprotocol/sdk/client";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/** Cloudinary config */
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD}/auto/upload`;

/** Cerebras config */
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || "";
const CEREBRAS_URL = "https://api.cerebras.ai/v1";

/** ChromaDB client */
const CHROMA = new ChromaClient({ path: process.env.CHROMA_HOST || "http://localhost:8000" });
const COLLECTION_NAME = "document_embeddings";

let collection: Collection | null = null;

/** Upload file to Cloudinary */
async function uploadToCloudinary(filePath: string): Promise<string> {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("upload_preset", process.env.CLOUDINARY_PRESET || "documents");

  const resp = await axios.post(CLOUDINARY_URL, form, {
    headers: { ...form.getHeaders() }
  });
  return resp.data.secure_url;
}

/** Extract text */
async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const fileBuffer = fs.readFileSync(filePath);

  if (ext === "pdf") {
    const pdfData = await pdf(fileBuffer);
    return pdfData.text;
  }
  return fileBuffer.toString("utf-8");
}

/** Initialize or get Chroma collection */
async function getOrCreateCollection(): Promise<Collection> {
  if (collection) return collection;
  try {
    collection = await CHROMA.createCollection({
      name: COLLECTION_NAME,
      metadata: { description: "Document embeddings" }
    });
  } catch (e: any) {
    if (e.message.includes("already exists")) {
      collection = await CHROMA.getCollection({ name: COLLECTION_NAME });
    } else {
      throw e;
    }
  }
  return collection!;
}

/** Create embedding text vector using Cerebras */
async function createEmbedding(text: string): Promise<number[] | null> {
  try {
    const resp = await axios.post(`${CEREBRAS_URL}/embeddings`, {
      model: "llama-3.1-8b-embedding", // ✅ pick correct Cerebras model
      input: [text],
    }, {
      headers: { Authorization: `Bearer ${CEREBRAS_API_KEY}` }
    });
    return resp.data.data[0].embedding as number[];
  } catch (err) {
    console.error("[DOC PARSER] Embedding failed:", err);
    return null;
  }
}

/** Chunk text into overlapping chunks */
function chunkText(text: string, window = 1000, overlap = 200): { content: string, idx: number }[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += window - overlap) {
    chunks.push({ content: text.slice(i, i + window), idx: chunks.length });
  }
  return chunks;
}

/** Main parse and embed function */
export async function parseAndEmbedDoc(filePath: string, documentId: string) {
  // 1. Upload file
  const cloudUrl = await uploadToCloudinary(filePath);

  // 2. Extract text
  const text = await extractTextFromFile(filePath);
  const chunks = chunkText(text);

  // 3. Get collection
  const chromaCollection = await getOrCreateCollection();

  const embeddings: number[][] = [];
  const documents: string[] = [];
  const metadatas: any[] = [];
  const ids: string[] = [];

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.content);
    if (embedding) {
      embeddings.push(embedding);
      documents.push(chunk.content);
      ids.push(`${documentId}_chunk_${chunk.idx}`);
      metadatas.push({ documentId, cloudinary_url: cloudUrl, chunkIndex: chunk.idx });
    }
  }

  // 4. Add to ChromaDB
  await chromaCollection.add({ embeddings, documents, metadatas, ids });

  return {
    documentId,
    cloudUrl,
    chunksIndexed: ids.length,
    status: "success"
  };
}

/* ---------------- MCP CLIENT ---------------- */
const client = new Client({
  name: "doc-parser-agent",
  version: "0.0.1",
});

/** Expose doc-parser as a tool */
(client as any).tool("doc-parser", {
  description: "Parse a document, upload to Cloudinary, and embed in ChromaDB",
  inputSchema: z.object({
    filePath: z.string(),
    documentId: z.string(),
  }),
  async handler({ filePath, documentId }: { filePath: string; documentId: string }) {
    return await parseAndEmbedDoc(filePath, documentId);
  },
});

/** Connect to Orchestrator MCP */
client.connect(new StdioServerTransport());
