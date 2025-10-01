/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ChromaClient, Collection, Where } from "chromadb";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { Client } from "@modelcontextprotocol/sdk/client";
import { z } from "zod";

/** Universal fallback */
import { llmWithFallback } from "@/app/server/fallbackLLM/openRouter";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/** Cerebras config */
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || "";
const CEREBRAS_URL = "https://api.cerebras.ai/v1";

/** LiveKit config */
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "";
const LIVEKIT_URL = process.env.LIVEKIT_URL || "wss://your-livekit-server.com";

/** ChromaDB client */
const CHROMA = new ChromaClient({ path: process.env.CHROMA_HOST || "http://localhost:8000" });
const COLLECTION_NAME = "document_embeddings";

let collection: Collection | null = null;

/** Metadata associated with embedded chunks */
type ChunkMetadata = {
  documentId?: string;
  cloudinary_url?: string;
  chunkIndex?: number;
};

/** Initialize MCP client */
const client = new Client({
  name: "doc-query-agent",
  version: "0.0.1",
});



export async function queryDocumentWrapper(input: {
    question: string;
    documentId?: string;
    topK?: number;
    includeContext?: boolean;
  }) {
    return await (client as any).tools.queryDocument.handler(input);
  }
  
  export async function queryAllDocumentsWrapper(input: {
    question: string;
    topK?: number;
    includeContext?: boolean;
  }) {
    return await (client as any).tools.queryAllDocuments.handler(input);
  }
  
  export async function getSimilarQuestionsWrapper(input: {
    question: string;
    documentId?: string;
    limit?: number;
  }) {
    return await (client as any).tools.getSimilarQuestions.handler(input);
  }
/** Initialize or get Chroma collection */
async function getCollection(): Promise<Collection> {
  if (collection) return collection;
  collection = await CHROMA.getCollection({ name: COLLECTION_NAME });
  return collection;
}

/** Create query embedding using Cerebras */
async function createQueryEmbedding(query: string): Promise<number[]> {
  const resp = await axios.post(
    `${CEREBRAS_URL}/embeddings`,
    {
      model: "text-embedding-ada-002",
      input: [query],
    },
    {
      headers: { Authorization: `Bearer ${CEREBRAS_API_KEY}` },
    }
  );
  return resp.data.data[0].embedding as number[];
}

/** Perform semantic search */
async function semanticSearch(
  query: string,
  documentId?: string,
  topK = 5
): Promise<{ chunks: Array<{ content: string; metadata: ChunkMetadata; distance: number }>; relevantContext: string }> {
  const chromaCollection = await getCollection();
  const queryEmbedding = await createQueryEmbedding(query);

  const searchParams: {
    queryEmbeddings: number[][];
    nResults: number;
    include: Array<"documents" | "metadatas" | "distances">;
    where?: Where;
  } = {
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
    include: ["documents", "metadatas", "distances"],
  };

  if (documentId) {
    searchParams.where = { documentId } as Where;
  }

  const results = await chromaCollection.query(searchParams);

  const docs = (results.documents?.[0] ?? []).filter((d): d is string => d != null);
  const metas = (results.metadatas?.[0] ?? []).map((m) => m ?? {});
  const dists = (results.distances?.[0] ?? []).map((d) => d ?? 1);

  const chunks = docs.map((doc, index) => ({
    content: doc,
    metadata: metas[index] as ChunkMetadata,
    distance: dists[index] as number,
  }));

  const relevantContext = chunks.map((chunk) => chunk.content).join("\n\n");

  return { chunks, relevantContext };
}

/** Generate contextual answer */
async function generateContextualAnswer(question: string, context: string, documentId?: string): Promise<string> {
  const prompt = `Based on the following context from ${documentId ? `document ${documentId}` : "the documents"}, please answer:

Context:
${context}

Question: ${question}`;

  return await llmWithFallback(prompt, async () => {
    const resp = await axios.post(
      `${CEREBRAS_URL}/chat/completions`,
      {
        model: "llama-4-turbo",
        messages: [
          { role: "system", content: "You are a knowledgeable assistant that answers based on provided context." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      },
      { headers: { Authorization: `Bearer ${CEREBRAS_API_KEY}` } }
    );
    return resp.data.choices[0].message.content;
  });
}

/** Wrap queryDocument as MCP tool */
(client as any).tool("queryDocument", {
  description: "Query a specific document by ID with semantic search + LLM answer",
  inputSchema: z.object({
    question: z.string(),
    documentId: z.string().optional(),
    topK: z.number().optional(),
    includeContext: z.boolean().optional(),
  }),
  async handler({ question, documentId, topK = 5, includeContext = false }: { question: string; documentId: string; topK: number; includeContext: boolean }) {
    const searchResults = await semanticSearch(question, documentId, topK);
    const answer = await generateContextualAnswer(question, searchResults.relevantContext, documentId);

    return {
      question,
      answer,
      sources: searchResults.chunks.map((chunk) => ({
        content: chunk.content,
        metadata: chunk.metadata,
        relevanceScore: Math.round((1 - chunk.distance) * 100),
      })),
      context: includeContext ? searchResults.relevantContext : undefined,
    };
  },
});

/** Wrap queryAllDocuments as MCP tool */
(client as any).tool("queryAllDocuments", {
  description: "Query across all documents in ChromaDB",
  inputSchema: z.object({
    question: z.string(),
    topK: z.number().optional(),
    includeContext: z.boolean().optional(),
  }),
  async handler({ question, topK = 5, includeContext = false }: { question: string; topK: number; includeContext: boolean }) {
    const result = await semanticSearch(question, undefined, topK);
    const answer = await generateContextualAnswer(question, result.relevantContext);

    return {
      question,
      answer,
      sources: result.chunks,
      context: includeContext ? result.relevantContext : undefined,
    };
  },
});

/** Wrap getSimilarQuestions as MCP tool */
(client as any).tool("getSimilarQuestions", {
  description: "Suggest similar user questions based on document context",
  inputSchema: z.object({
    question: z.string(),
    documentId: z.string().optional(),
    limit: z.number().optional(),
  }),
  async handler({ question, documentId, limit = 3 }: { question: string; documentId: string; limit: number }) {
    const searchResults = await semanticSearch(question, documentId, limit);
    const contextSample = searchResults.relevantContext.substring(0, 500);

    const prompt = `Suggest ${limit} different questions a user might ask about this context:\n\n${contextSample}`;

    const suggestions = await llmWithFallback(prompt, async () => {
      const resp = await axios.post(
        `${CEREBRAS_URL}/chat/completions`,
        { model: "llama-4-turbo", messages: [{ role: "user", content: prompt }] },
        { headers: { Authorization: `Bearer ${CEREBRAS_API_KEY}` } }
      );
      return resp.data.choices[0].message.content;
    });

    return { suggestions };
  },
});

/** Connect MCP client */
client.connect(new StdioServerTransport());
