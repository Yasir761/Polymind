/* eslint-disable @typescript-eslint/no-explicit-any */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "polymind-orchestrator",
  version: "0.3.0",
});

// ---------------------------
// Route Tool: Call any agent
// ---------------------------
server.registerTool("route", {
  title: "Route to Agent",
  description: "Call any individual agent",
  inputSchema: {
    agent: z.string(),
    input: z.unknown(),
  }
}, async ({ agent, input }) => {
  try {
    console.log(`[ROUTE] Calling agent: ${agent} with input:`, input);
    
    switch (agent) {
      case "doc-parser":
        const docResult = await callDocParserAgent(input);
        return { 
          content: [{ type: "text", text: docResult }]
        };

      case "summary":
        const summaryResult = await callSummaryAgent(input);
        return { 
          content: [{ type: "text", text: summaryResult }]
        };

      case "query":
        const queryResult = await callQueryAgent(input);
        return { 
          content: [{ type: "text", text: queryResult }]
        };

      case "livekit-stt":
        const sttResult = await callLiveKitSTTAgent(input);
        return { 
          content: [{ type: "text", text: sttResult }]
        };

      case "livekit-tts":
        const ttsResult = await callLiveKitTTSAgent(input);
        return { 
          content: [{ type: "text", text: ttsResult }]
        };

      case "exa":
        try {
          const result = await callExaAgent(input);
          return { 
            content: [{ type: "text", text: JSON.stringify(result) }]
          };
        } catch (error: any) {
          console.error("[EXA] Error calling Exa via MCP Gateway:", error);
          return { 
            content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
            isError: true
          };
        }

      default:
        return { 
          content: [{ type: "text", text: `Unknown agent: ${agent}` }],
          isError: true
        };
    }
  } catch (error: any) {
    console.error(`[ROUTE] Error calling agent ${agent}:`, error);
    return { 
      content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
      isError: true
    };
  }
});

// ---------------------------
// Handle Request Tool: Dynamic workflow
// ---------------------------
server.registerTool("handleRequest", {
  title: "Handle User Request",
  description: "Dynamic workflow based on user input & document",
  inputSchema: {
    text: z.string(),
    voice: z.string().optional(),
    document: z.string().optional(),
    action: z.enum(["summarize", "query", "research"]),
    voiceOutput: z.boolean().default(false),
  }
}, async ({ text, voice, document, action, voiceOutput }) => {
  try {
    console.log(`[WORKFLOW] Starting workflow - Action: ${action}, Voice: ${!!voice}, Document: ${!!document}`);
    
    let userText = text;

    // 1️⃣ If voice input, transcribe first
    if (voice) {
      console.log("[WORKFLOW] Transcribing voice input...");
      const sttResult = await callRouteAgent("livekit-stt", { audio: voice });
      
      if (sttResult.isError) {
        throw new Error(`STT failed: ${sttResult.content[0].text}`);
      }
      
      userText = sttResult.content[0].text;
      console.log(`[WORKFLOW] Transcribed text: ${userText}`);
    }

    let finalText = "";

    // 2️⃣ Document workflow
    if (document) {
      console.log("[WORKFLOW] Processing document workflow...");
      
      // Embed the document first
      const docEmbedding = await callRouteAgent("doc-parser", { text: document });

      if (docEmbedding.isError) {
        throw new Error(`Document parsing failed: ${docEmbedding.content[0].text}`);
      }

      if (action === "summarize") {
        console.log("[WORKFLOW] Generating summary...");
        const summaryResult = await callRouteAgent("summary", { doc: docEmbedding.content[0].text });
        
        if (summaryResult.isError) {
          throw new Error(`Summarization failed: ${summaryResult.content[0].text}`);
        }
        
        finalText = summaryResult.content[0].text;
        
      } else if (action === "query") {
        console.log("[WORKFLOW] Querying document...");
        const queryResult = await callRouteAgent("query", { doc: docEmbedding.content[0].text, question: userText });
        
        if (queryResult.isError) {
          throw new Error(`Document query failed: ${queryResult.content[0].text}`);
        }
        
        finalText = queryResult.content[0].text;
        
      } else if (action === "research") {
        console.log("[WORKFLOW] Researching with document context...");
        const researchResult = await callRouteAgent("exa", { query: `${document} ${userText}` });
        
        if (researchResult.isError) {
          throw new Error(`Research failed: ${researchResult.content[0].text}`);
        }
        
        finalText = researchResult.content[0].text;
      }
    } 
    // 3️⃣ No document → just chat/research via Exa
    else {
      console.log("[WORKFLOW] Performing research without document...");
      const researchResult = await callRouteAgent("exa", { query: userText });
      
      if (researchResult.isError) {
        throw new Error(`Research failed: ${researchResult.content[0].text}`);
      }
      
      finalText = researchResult.content[0].text;
    }

    // 4️⃣ Optional voice output
    let ttsResult = null;
    if (voiceOutput && finalText) {
      console.log("[WORKFLOW] Generating voice output...");
      const voiceResult = await callRouteAgent("livekit-tts", { text: finalText });
      
      if (!voiceResult.isError) {
        ttsResult = voiceResult.content[0].text;
      } else {
        console.error("[WORKFLOW] TTS failed:", voiceResult.content[0].text);
      }
    }

    console.log("[WORKFLOW] Workflow completed successfully");
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          text: finalText,
          voice: ttsResult,
          success: true,
        })
      }]
    };
    
  } catch (error: any) {
    console.error("[WORKFLOW] Workflow error:", error);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          text: null,
          voice: null,
          success: false,
          error: error.message,
        })
      }],
      isError: true
    };
  }
});

// ---------------------------
// Helper function to call route tool internally
// ---------------------------
async function callRouteAgent(agent: string, input: any) {
  // Direct function calls to agent implementations
  try {
    console.log(`[INTERNAL] Calling agent: ${agent} with input:`, input);
    
    switch (agent) {
      case "doc-parser":
        const docResult = await callDocParserAgent(input);
        return { 
          content: [{ type: "text", text: docResult }]
        };

      case "summary":
        const summaryResult = await callSummaryAgent(input);
        return { 
          content: [{ type: "text", text: summaryResult }]
        };

      case "query":
        const queryResult = await callQueryAgent(input);
        return { 
          content: [{ type: "text", text: queryResult }]
        };

      case "livekit-stt":
        const sttResult = await callLiveKitSTTAgent(input);
        return { 
          content: [{ type: "text", text: sttResult }]
        };

      case "livekit-tts":
        const ttsResult = await callLiveKitTTSAgent(input);
        return { 
          content: [{ type: "text", text: ttsResult }]
        };

      case "exa":
        try {
          const result = await callExaAgent(input);
          return { 
            content: [{ type: "text", text: JSON.stringify(result) }]
          };
        } catch (error: any) {
          console.error("[EXA] Error calling Exa:", error);
          return { 
            content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
            isError: true
          };
        }

      default:
        return { 
          content: [{ type: "text", text: `Unknown agent: ${agent}` }],
          isError: true
        };
    }
  } catch (error: any) {
    console.error(`[INTERNAL] Error calling agent ${agent}:`, error);
    return { 
      content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
      isError: true
    };
  }
}

// ---------------------------
// Agent Implementation Functions (To be implemented)
// ---------------------------

async function callDocParserAgent(input: any): Promise<string> {
  // TODO: Implement real document parser
  return `[MOCK] Doc Parser embeddings for: ${JSON.stringify(input)}`;
}

async function callSummaryAgent(input: any): Promise<string> {
  // TODO: Implement real summary agent using Cerebras
  return `[MOCK] Summary: ${JSON.stringify(input)}`;
}

async function callQueryAgent(input: any): Promise<string> {
  // TODO: Implement real query agent using ChromaDB
  return `[MOCK] Query result: ${JSON.stringify(input)}`;
}

async function callLiveKitSTTAgent(input: any): Promise<string> {
  // TODO: Implement real LiveKit STT
  return `[MOCK] STT transcription: ${JSON.stringify(input)}`;
}

async function callLiveKitTTSAgent(input: any): Promise<string> {
  // TODO: Implement real LiveKit TTS
  return `[MOCK] TTS voice output: ${JSON.stringify(input)}`;
}

async function callExaAgent(input: any): Promise<any> {
  // Option 1: Direct HTTP call to MCP Gateway
  try {
    const response = await fetch("http://localhost:8000/api/v1/agents/exa/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: (input as any).query || input })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("[EXA] Error calling Exa via HTTP:", error);
    // Fallback to mock for now
    return `[MOCK] Exa research result: ${JSON.stringify(input)}`;
  }
}

// ---------------------------
// Start MCP Server
// ---------------------------
async function startServer() {
  try {
    console.log("[SERVER] Starting POLYMIND MCP Orchestrator...");
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.log("[SERVER] POLYMIND MCP Orchestrator started successfully!");
    console.log("[SERVER] Available tools: route, handleRequest");
    console.log("[SERVER] Supported agents: doc-parser, summary, query, livekit-stt, livekit-tts, exa");
  } catch (error: any) {
    console.error("[SERVER] Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
  process.exit(0);
});

startServer();
