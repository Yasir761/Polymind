// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// // import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// // import { z } from "zod";

// // const server = new McpServer({
// //   name: "polymind-orchestrator",
// //   version: "0.0.1",
// // });

// // // ---------------------------
// // // Route Tool: Call any agent
// // // ---------------------------
// // server.registerTool("route", {
// //   title: "Route to Agent",
// //   description: "Call any individual agent",
// //   inputSchema: {
// //     agent: z.string(),
// //     input: z.unknown(),
// //   }
// // }, async ({ agent, input }) => {
// //   try {
// //     console.log(`[ROUTE] Calling agent: ${agent} with input:`, input);
    
// //     switch (agent) {
// //       case "doc-parser":
// //         const docResult = await callDocParserAgent(input);
// //         return { 
// //           content: [{ type: "text", text: docResult }]
// //         };

// //       case "summary":
// //         const summaryResult = await callSummaryAgent(input);
// //         return { 
// //           content: [{ type: "text", text: summaryResult }]
// //         };

// //       case "query":
// //         const queryResult = await callQueryAgent(input);
// //         return { 
// //           content: [{ type: "text", text: queryResult }]
// //         };

// //       case "livekit-stt":
// //         const sttResult = await callLiveKitSTTAgent(input);
// //         return { 
// //           content: [{ type: "text", text: sttResult }]
// //         };

// //       case "livekit-tts":
// //         const ttsResult = await callLiveKitTTSAgent(input);
// //         return { 
// //           content: [{ type: "text", text: ttsResult }]
// //         };

// //       case "exa":
// //         try {
// //           const result = await callExaAgent(input);
// //           return { 
// //             content: [{ type: "text", text: JSON.stringify(result) }]
// //           };
// //         } catch (error: any) {
// //           console.error("[EXA] Error calling Exa via MCP Gateway:", error);
// //           return { 
// //             content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
// //             isError: true
// //           };
// //         }

// //       default:
// //         return { 
// //           content: [{ type: "text", text: `Unknown agent: ${agent}` }],
// //           isError: true
// //         };
// //     }
// //   } catch (error: any) {
// //     console.error(`[ROUTE] Error calling agent ${agent}:`, error);
// //     return { 
// //       content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
// //       isError: true
// //     };
// //   }
// // });

// // // ---------------------------
// // // Handle Request Tool: Dynamic workflow
// // // ---------------------------
// // server.registerTool("handleRequest", {
// //   title: "Handle User Request",
// //   description: "Dynamic workflow based on user input & document",
// //   inputSchema: {
// //     text: z.string(),
// //     voice: z.string().optional(),
// //     document: z.string().optional(),
// //     action: z.enum(["summarize", "query", "research"]),
// //     voiceOutput: z.boolean().default(false),
// //   }
// // }, async ({ text, voice, document, action, voiceOutput }) => {
// //   try {
// //     console.log(`[WORKFLOW] Starting workflow - Action: ${action}, Voice: ${!!voice}, Document: ${!!document}`);
    
// //     let userText = text;

// //     // 1️⃣ If voice input, transcribe first
// //     if (voice) {
// //       console.log("[WORKFLOW] Transcribing voice input...");
// //       const sttResult = await callRouteAgent("livekit-stt", { audio: voice });
      
// //       if (sttResult.isError) {
// //         throw new Error(`STT failed: ${sttResult.content[0].text}`);
// //       }
      
// //       userText = sttResult.content[0].text;
// //       console.log(`[WORKFLOW] Transcribed text: ${userText}`);
// //     }

// //     let finalText = "";

// //     // 2️⃣ Document workflow
// //     if (document) {
// //       console.log("[WORKFLOW] Processing document workflow...");
      
// //       // Embed the document first
// //       const docEmbedding = await callRouteAgent("doc-parser", { text: document });

// //       if (docEmbedding.isError) {
// //         throw new Error(`Document parsing failed: ${docEmbedding.content[0].text}`);
// //       }

// //       if (action === "summarize") {
// //         console.log("[WORKFLOW] Generating summary...");
// //         const summaryResult = await callRouteAgent("summary", { doc: docEmbedding.content[0].text });
        
// //         if (summaryResult.isError) {
// //           throw new Error(`Summarization failed: ${summaryResult.content[0].text}`);
// //         }
        
// //         finalText = summaryResult.content[0].text;
        
// //       } else if (action === "query") {
// //         console.log("[WORKFLOW] Querying document...");
// //         const queryResult = await callRouteAgent("query", { doc: docEmbedding.content[0].text, question: userText });
        
// //         if (queryResult.isError) {
// //           throw new Error(`Document query failed: ${queryResult.content[0].text}`);
// //         }
        
// //         finalText = queryResult.content[0].text;
        
// //       } else if (action === "research") {
// //         console.log("[WORKFLOW] Researching with document context...");
// //         const researchResult = await callRouteAgent("exa", { query: `${document} ${userText}` });
        
// //         if (researchResult.isError) {
// //           throw new Error(`Research failed: ${researchResult.content[0].text}`);
// //         }
        
// //         finalText = researchResult.content[0].text;
// //       }
// //     } 
// //     // 3️⃣ No document → just chat/research via Exa
// //     else {
// //       console.log("[WORKFLOW] Performing research without document...");
// //       const researchResult = await callRouteAgent("exa", { query: userText });
      
// //       if (researchResult.isError) {
// //         throw new Error(`Research failed: ${researchResult.content[0].text}`);
// //       }
      
// //       finalText = researchResult.content[0].text;
// //     }

// //     // 4️⃣ Optional voice output
// //     let ttsResult = null;
// //     if (voiceOutput && finalText) {
// //       console.log("[WORKFLOW] Generating voice output...");
// //       const voiceResult = await callRouteAgent("livekit-tts", { text: finalText });
      
// //       if (!voiceResult.isError) {
// //         ttsResult = voiceResult.content[0].text;
// //       } else {
// //         console.error("[WORKFLOW] TTS failed:", voiceResult.content[0].text);
// //       }
// //     }

// //     console.log("[WORKFLOW] Workflow completed successfully");
    
// //     return {
// //       content: [{
// //         type: "text",
// //         text: JSON.stringify({
// //           text: finalText,
// //           voice: ttsResult,
// //           success: true,
// //         })
// //       }]
// //     };
    
// //   } catch (error: any) {
// //     console.error("[WORKFLOW] Workflow error:", error);
// //     return {
// //       content: [{
// //         type: "text",
// //         text: JSON.stringify({
// //           text: null,
// //           voice: null,
// //           success: false,
// //           error: error.message,
// //         })
// //       }],
// //       isError: true
// //     };
// //   }
// // });

// // // ---------------------------
// // // Helper function to call route tool internally
// // // ---------------------------
// // async function callRouteAgent(agent: string, input: any) {
// //   // Direct function calls to agent implementations
// //   try {
// //     console.log(`[INTERNAL] Calling agent: ${agent} with input:`, input);
    
// //     switch (agent) {
// //       case "doc-parser":
// //         const docResult = await callDocParserAgent(input);
// //         return { 
// //           content: [{ type: "text", text: docResult }]
// //         };

// //       case "summary":
// //         const summaryResult = await callSummaryAgent(input);
// //         return { 
// //           content: [{ type: "text", text: summaryResult }]
// //         };

// //       case "query":
// //         const queryResult = await callQueryAgent(input);
// //         return { 
// //           content: [{ type: "text", text: queryResult }]
// //         };

// //       case "livekit-stt":
// //         const sttResult = await callLiveKitSTTAgent(input);
// //         return { 
// //           content: [{ type: "text", text: sttResult }]
// //         };

// //       case "livekit-tts":
// //         const ttsResult = await callLiveKitTTSAgent(input);
// //         return { 
// //           content: [{ type: "text", text: ttsResult }]
// //         };

// //       case "exa":
// //         try {
// //           const result = await callExaAgent(input);
// //           return { 
// //             content: [{ type: "text", text: JSON.stringify(result) }]
// //           };
// //         } catch (error: any) {
// //           console.error("[EXA] Error calling Exa:", error);
// //           return { 
// //             content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
// //             isError: true
// //           };
// //         }

// //       default:
// //         return { 
// //           content: [{ type: "text", text: `Unknown agent: ${agent}` }],
// //           isError: true
// //         };
// //     }
// //   } catch (error: any) {
// //     console.error(`[INTERNAL] Error calling agent ${agent}:`, error);
// //     return { 
// //       content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
// //       isError: true
// //     };
// //   }
// // }

// // // ---------------------------
// // // Agent Implementation Functions (To be implemented)
// // // ---------------------------

// // async function callDocParserAgent(input: any): Promise<string> {
// //   // TODO: Implement real document parser
// //   return `[MOCK] Doc Parser embeddings for: ${JSON.stringify(input)}`;
// // }

// // async function callSummaryAgent(input: any): Promise<string> {
// //   // TODO: Implement real summary agent using Cerebras
// //   return `[MOCK] Summary: ${JSON.stringify(input)}`;
// // }

// // async function callQueryAgent(input: any): Promise<string> {
// //   // TODO: Implement real query agent using ChromaDB
// //   return `[MOCK] Query result: ${JSON.stringify(input)}`;
// // }

// // async function callLiveKitSTTAgent(input: any): Promise<string> {
// //   // TODO: Implement real LiveKit STT
// //   return `[MOCK] STT transcription: ${JSON.stringify(input)}`;
// // }

// // async function callLiveKitTTSAgent(input: any): Promise<string> {
// //   // TODO: Implement real LiveKit TTS
// //   return `[MOCK] TTS voice output: ${JSON.stringify(input)}`;
// // }

// // async function callExaAgent(input: any): Promise<any> {
// //   // Option 1: Direct HTTP call to MCP Gateway
// //   try {
// //     const response = await fetch("http://localhost:8000/api/v1/agents/exa/execute", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ input: (input as any).query || input })
// //     });
    
// //     if (!response.ok) {
// //       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
// //     }
    
// //     const result = await response.json();
// //     return result;
// //   } catch (error: any) {
// //     console.error("[EXA] Error calling Exa via HTTP:", error);
// //     // Fallback to mock for now
// //     return `[MOCK] Exa research result: ${JSON.stringify(input)}`;
// //   }
// // }

// // // ---------------------------
// // // Start MCP Server
// // // ---------------------------
// // async function startServer() {
// //   try {
// //     console.log("[SERVER] Starting POLYMIND MCP Orchestrator...");
    
// //     const transport = new StdioServerTransport();
// //     await server.connect(transport);
    
// //     console.log("[SERVER] POLYMIND MCP Orchestrator started successfully!");
// //     console.log("[SERVER] Available tools: route, handleRequest");
// //     console.log("[SERVER] Supported agents: doc-parser, summary, query, livekit-stt, livekit-tts, exa");
// //   } catch (error: any) {
// //     console.error("[SERVER] Failed to start MCP server:", error);
// //     process.exit(1);
// //   }
// // }

// // // Handle graceful shutdown
// // process.on('SIGINT', () => {
// //   console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
// //   process.exit(0);
// // });

// // process.on('SIGTERM', () => {
// //   console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
// //   process.exit(0);
// // });

// // startServer();







// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";

// // Import your actual agents
// import { parseAndEmbedDoc } from "@/app/server/agents/documentParser.js";
// import { summarizeDocument, getAvailableDocuments } from "@/app/server/agents/summary.js";
// import { queryDocument, queryAllDocuments, getSimilarQuestions } from "@/app/server/agents/query.js";

// const server = new McpServer({
//   name: "polymind-orchestrator",
//   version: "0.0.1",
// });

// // ---------------------------
// // Route Tool: Call any agent
// // ---------------------------
// server.registerTool("route", {
//   title: "Route to Agent",
//   description: "Call any individual agent",
//   inputSchema: {
//     agent: z.string(),
//     input: z.unknown(),
//   }
// }, async ({ agent, input }) => {
//   try {
//     console.log(`[ROUTE] Calling agent: ${agent} with input:`, input);
    
//     switch (agent) {
//       case "doc-parser":
//         const docResult = await callDocParserAgent(input);
//         return { 
//           content: [{ type: "text", text: docResult }]
//         };

//       case "summary":
//         const summaryResult = await callSummaryAgent(input);
//         return { 
//           content: [{ type: "text", text: summaryResult }]
//         };

//       case "query":
//         const queryResult = await callQueryAgent(input);
//         return { 
//           content: [{ type: "text", text: queryResult }]
//         };

//       case "livekit-stt":
//         const sttResult = await callLiveKitSTTAgent(input);
//         return { 
//           content: [{ type: "text", text: sttResult }]
//         };

//       case "livekit-tts":
//         const ttsResult = await callLiveKitTTSAgent(input);
//         return { 
//           content: [{ type: "text", text: ttsResult }]
//         };

//       case "exa":
//         try {
//           const result = await callExaAgent(input);
//           return { 
//             content: [{ type: "text", text: JSON.stringify(result) }]
//           };
//         } catch (error: any) {
//           console.error("[EXA] Error calling Exa via MCP Gateway:", error);
//           return { 
//             content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
//             isError: true
//           };
//         }

//       default:
//         return { 
//           content: [{ type: "text", text: `Unknown agent: ${agent}` }],
//           isError: true
//         };
//     }
//   } catch (error: any) {
//     console.error(`[ROUTE] Error calling agent ${agent}:`, error);
//     return { 
//       content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
//       isError: true
//     };
//   }
// });

// // ---------------------------
// // Handle Request Tool: Dynamic workflow
// // ---------------------------
// server.registerTool("handleRequest", {
//   title: "Handle User Request",
//   description: "Dynamic workflow based on user input & document",
//   inputSchema: {
//     text: z.string(),
//     voice: z.string().optional(),
//     document: z.string().optional(),
//     documentId: z.string().optional(),
//     filePath: z.string().optional(),
//     action: z.enum(["parse", "summarize", "query", "research"]),
//     voiceOutput: z.boolean().default(false),
//     summaryType: z.enum(["brief", "detailed", "bullet-points"]).optional(),
//     roomName: z.string().optional(),
//     topK: z.number().optional(),
//     includeContext: z.boolean().optional(),
//   }
// }, async ({ text, voice, document, documentId, filePath, action, voiceOutput, summaryType, roomName, topK, includeContext }) => {
//   try {
//     console.log(`[WORKFLOW] Starting workflow - Action: ${action}, Voice: ${!!voice}, Document: ${!!document}`);
    
//     let userText = text;

//     // 1️⃣ If voice input, transcribe first
//     if (voice) {
//       console.log("[WORKFLOW] Transcribing voice input...");
//       const sttResult = await callRouteAgent("livekit-stt", { audio: voice });
      
//       if (sttResult.isError) {
//         throw new Error(`STT failed: ${sttResult.content[0].text}`);
//       }
      
//       userText = sttResult.content[0].text;
//       console.log(`[WORKFLOW] Transcribed text: ${userText}`);
//     }

//     let finalText = "";
//     let finalResult: any = {};

//     // 2️⃣ Handle different actions
//     switch (action) {
//       case "parse":
//         console.log("[WORKFLOW] Parsing document...");
//         if (!filePath && !document) {
//           throw new Error("File path or document content required for parsing");
//         }
        
//         const parseResult = await callRouteAgent("doc-parser", { 
//           filePath, 
//           content: document, 
//           documentId: documentId || `doc_${Date.now()}`
//         });
        
//         if (parseResult.isError) {
//           throw new Error(`Document parsing failed: ${parseResult.content[0].text}`);
//         }
        
//         finalResult = JSON.parse(parseResult.content[0].text);
//         finalText = `Document parsed successfully. Document ID: ${finalResult.documentId}, Chunks indexed: ${finalResult.chunksIndexed}, Status: ${finalResult.status}`;
//         break;

//       case "summarize":
//         console.log("[WORKFLOW] Generating summary...");
//         if (!documentId) {
//           throw new Error("Document ID required for summarization");
//         }
        
//         const summaryResult = await callRouteAgent("summary", { 
//           documentId, 
//           summaryType: summaryType || "detailed",
//           enableTTS: voiceOutput,
//           roomName
//         });
        
//         if (summaryResult.isError) {
//           throw new Error(`Summarization failed: ${summaryResult.content[0].text}`);
//         }
        
//         finalResult = JSON.parse(summaryResult.content[0].text);
//         finalText = finalResult.summary;
//         break;

//       case "query":
//         console.log("[WORKFLOW] Querying document...");
//         if (!userText) {
//           throw new Error("Question text required for querying");
//         }
        
//         const queryResult = await callRouteAgent("query", { 
//           question: userText, 
//           documentId,
//           enableTTS: voiceOutput,
//           roomName,
//           topK: topK || 5,
//           includeContext: includeContext || false
//         });
        
//         if (queryResult.isError) {
//           throw new Error(`Document query failed: ${queryResult.content[0].text}`);
//         }
        
//         finalResult = JSON.parse(queryResult.content[0].text);
//         finalText = finalResult.answer;
//         break;

//       case "research":
//         console.log("[WORKFLOW] Researching with Exa...");
//         const researchQuery = document ? `${document} ${userText}` : userText;
//         const researchResult = await callRouteAgent("exa", { query: researchQuery });
        
//         if (researchResult.isError) {
//           throw new Error(`Research failed: ${researchResult.content[0].text}`);
//         }
        
//         finalText = researchResult.content[0].text;
//         finalResult = { research: finalText };
//         break;

//       default:
//         throw new Error(`Unknown action: ${action}`);
//     }

//     // 3️⃣ Optional voice output (if not already handled by agents)
//     let ttsResult = null;
//     if (voiceOutput && finalText && !finalResult.audioUrl) {
//       console.log("[WORKFLOW] Generating voice output...");
//       const voiceResult = await callRouteAgent("livekit-tts", { 
//         text: finalText,
//         roomName 
//       });
      
//       if (!voiceResult.isError) {
//         ttsResult = voiceResult.content[0].text;
//       } else {
//         console.error("[WORKFLOW] TTS failed:", voiceResult.content[0].text);
//       }
//     }

//     console.log("[WORKFLOW] Workflow completed successfully");
    
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify({
//           action,
//           text: finalText,
//           voice: ttsResult || finalResult.audioUrl,
//           liveKitToken: finalResult.liveKitToken,
//           result: finalResult,
//           success: true,
//         })
//       }]
//     };
    
//   } catch (error: any) {
//     console.error("[WORKFLOW] Workflow error:", error);
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify({
//           action,
//           text: null,
//           voice: null,
//           success: false,
//           error: error.message,
//         })
//       }],
//       isError: true
//     };
//   }
// });

// // ---------------------------
// // Additional Tools for Direct Agent Access
// // ---------------------------

// // Get available documents
// server.registerTool("listDocuments", {
//   title: "List Documents",
//   description: "Get all available documents in the system",
//   inputSchema: {}
// }, async () => {
//   try {
//     const result = await getAvailableDocuments();
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify(result)
//       }]
//     };
//   } catch (error: any) {
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify({
//           documents: [],
//           error: error.message
//         })
//       }],
//       isError: true
//     };
//   }
// });

// // Get question suggestions
// server.registerTool("getQuestionSuggestions", {
//   title: "Get Question Suggestions",
//   description: "Get suggested questions for a document",
//   inputSchema: {
//     question: z.string(),
//     documentId: z.string().optional(),
//     limit: z.number().default(3)
//   }
// }, async ({ question, documentId, limit }) => {
//   try {
//     const result = await getSimilarQuestions(question, documentId, limit);
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify(result)
//       }]
//     };
//   } catch (error: any) {
//     return {
//       content: [{
//         type: "text",
//         text: JSON.stringify({
//           suggestions: [],
//           error: error.message
//         })
//       }],
//       isError: true
//     };
//   }
// });

// // ---------------------------
// // Helper function to call route tool internally
// // ---------------------------
// async function callRouteAgent(agent: string, input: any) {
//   try {
//     console.log(`[INTERNAL] Calling agent: ${agent} with input:`, input);
    
//     switch (agent) {
//       case "doc-parser":
//         const docResult = await callDocParserAgent(input);
//         return { 
//           content: [{ type: "text", text: docResult }]
//         };

//       case "summary":
//         const summaryResult = await callSummaryAgent(input);
//         return { 
//           content: [{ type: "text", text: summaryResult }]
//         };

//       case "query":
//         const queryResult = await callQueryAgent(input);
//         return { 
//           content: [{ type: "text", text: queryResult }]
//         };

//       case "livekit-stt":
//         const sttResult = await callLiveKitSTTAgent(input);
//         return { 
//           content: [{ type: "text", text: sttResult }]
//         };

//       case "livekit-tts":
//         const ttsResult = await callLiveKitTTSAgent(input);
//         return { 
//           content: [{ type: "text", text: ttsResult }]
//         };

//       case "exa":
//         try {
//           const result = await callExaAgent(input);
//           return { 
//             content: [{ type: "text", text: JSON.stringify(result) }]
//           };
//         } catch (error: any) {
//           console.error("[EXA] Error calling Exa:", error);
//           return { 
//             content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }],
//             isError: true
//           };
//         }

//       default:
//         return { 
//           content: [{ type: "text", text: `Unknown agent: ${agent}` }],
//           isError: true
//         };
//     }
//   } catch (error: any) {
//     console.error(`[INTERNAL] Error calling agent ${agent}:`, error);
//     return { 
//       content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }],
//       isError: true
//     };
//   }
// }

// // ---------------------------
// // Agent Implementation Functions
// // ---------------------------

// async function callDocParserAgent(input: any): Promise<string> {
//   try {
//     const result = await parseAndEmbedDoc(
//       input.filePath, 
//       input.documentId || `doc_${Date.now()}`
//     );
//     return JSON.stringify(result);
//   } catch (error: any) {
//     console.error("Error calling document parser agent:", error);
//     return JSON.stringify({
//       success: false,
//       error: error.message
//     });
//   }
// }

// async function callSummaryAgent(input: any): Promise<string> {
//   try {
//     const result = await summarizeDocument(
//       input.documentId,
//       input.summaryType || "detailed",
//       input.enableTTS || false,
//       input.roomName
//     );
//     return JSON.stringify(result);
//   } catch (error: any) {
//     console.error("Error calling summary agent:", error);
//     return JSON.stringify({
//       success: false,
//       error: error.message
//     });
//   }
// }

// async function callQueryAgent(input: any): Promise<string> {
//   try {
//     const result = input.documentId 
//       ? await queryDocument(input.question, input.documentId, {
//           topK: input.topK,
//           enableTTS: input.enableTTS,
//           roomName: input.roomName,
//           includeContext: input.includeContext
//         })
//       : await queryAllDocuments(input.question, {
//           topK: input.topK,
//           enableTTS: input.enableTTS,
//           roomName: input.roomName,
//           includeContext: input.includeContext
//         });
    
//     return JSON.stringify(result);
//   } catch (error: any) {
//     console.error("Error calling query agent:", error);
//     return JSON.stringify({
//       success: false,
//       error: error.message
//     });
//   }
// }

// async function callLiveKitSTTAgent(input: any): Promise<string> {
//   // TODO: Implement real LiveKit STT
//   return `[MOCK] STT transcription: ${JSON.stringify(input)}`;
// }

// async function callLiveKitTTSAgent(input: any): Promise<string> {
//   // TODO: Implement real LiveKit TTS
//   return `[MOCK] TTS voice output: ${JSON.stringify(input)}`;
// }

// async function callExaAgent(input: any): Promise<any> {
//   try {
//     const response = await fetch("http://localhost:8000/api/v1/agents/exa/execute", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ input: (input as any).query || input })
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }
    
//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error("[EXA] Error calling Exa via HTTP:", error);
//     return `[MOCK] Exa research result: ${JSON.stringify(input)}`;
//   }
// }

// // ---------------------------
// // Start MCP Server
// // ---------------------------
// async function startServer() {
//   try {
//     console.log("[SERVER] Starting POLYMIND MCP Orchestrator...");
    
//     const transport = new StdioServerTransport();
//     await server.connect(transport);
    
//     console.log("[SERVER] POLYMIND MCP Orchestrator started successfully!");
//     console.log("[SERVER] Available tools: route, handleRequest, listDocuments, getQuestionSuggestions");
//     console.log("[SERVER] Supported agents: doc-parser, summary, query, livekit-stt, livekit-tts, exa");
//   } catch (error: any) {
//     console.error("[SERVER] Failed to start MCP server:", error);
//     process.exit(1);
//   }
// }

// // Handle graceful shutdown
// process.on('SIGINT', () => {
//   console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
//   process.exit(0);
// });

// process.on('SIGTERM', () => {
//   console.log('[SERVER] Gracefully shutting down POLYMIND MCP Orchestrator...');
//   process.exit(0);
// });

// startServer();



/* eslint-disable @typescript-eslint/no-explicit-any */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import your actual agents
import { parseAndEmbedDoc } from "@/app/server/agents/documentParser.js";
import { summarizeDocument, listDocuments } from "@/app/server/agents/summary.js";
import { 
  queryDocumentWrapper as queryDocument, 
  queryAllDocumentsWrapper as queryAllDocuments, 
  getSimilarQuestionsWrapper as getSimilarQuestions 
}  from "@/app/server/agents/query.js";

const server = new McpServer({
  name: "polymind-orchestrator",
  version: "0.0.1",
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
        return { content: [{ type: "text", text: await callDocParserAgent(input) }] };
      case "summary":
        return { content: [{ type: "text", text: await callSummaryAgent(input) }] };
      case "query":
        return { content: [{ type: "text", text: await callQueryAgent (input) }] };
      case "livekit-stt":
        return { content: [{ type: "text", text: await callLiveKitSTTAgent(input) }] };
      case "livekit-tts":
        return { content: [{ type: "text", text: await callLiveKitTTSAgent(input) }] };
      case "exa":
        try {
          const result = await callExaAgent(input);
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        } catch (error: any) {
          console.error("[EXA] Error calling Exa via MCP Gateway:", error);
          return { content: [{ type: "text", text: `Exa agent call failed: ${error.message}` }], isError: true };
        }
      default:
        console.log(`[ROUTE] Unknown agent requested, falling back to Exa`);
        const fallbackResult = await callExaAgent({ query: input });
        return { content: [{ type: "text", text: JSON.stringify(fallbackResult) }] };
    }
  } catch (error: any) {
    console.error(`[ROUTE] Error calling agent ${agent}:`, error);
    return { content: [{ type: "text", text: `Failed to call agent ${agent}: ${error.message}` }], isError: true };
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
    documentId: z.string().optional(),
    filePath: z.string().optional(),
    action: z.enum(["parse", "summarize", "query", "research"]).optional(),
    voiceOutput: z.boolean().default(false),
    summaryType: z.enum(["brief", "detailed", "bullet-points"]).optional(),
    roomName: z.string().optional(),
    topK: z.number().optional(),
    includeContext: z.boolean().optional(),
  }
}, async ({ text, voice, document, documentId, filePath, action, voiceOutput, summaryType, roomName, topK, includeContext }) => {
  try {
    console.log(`[WORKFLOW] Starting workflow - Action: ${action}, Voice: ${!!voice}, Document: ${!!document}`);
    
    let userText = text;

    // 1️⃣ Transcribe voice input if provided
    if (voice) {
      console.log("[WORKFLOW] Transcribing voice input...");
      const sttResult = await callRouteAgent("livekit-stt", { audio: voice });
      if (sttResult.isError) throw new Error(`STT failed: ${sttResult.content[0].text}`);
      userText = sttResult.content[0].text;
      console.log(`[WORKFLOW] Transcribed text: ${userText}`);
    }

    let finalText = "";
    let finalResult: any = {};

    // 2️⃣ Handle different actions
    switch (action) {
      case "parse":
        if (!filePath && !document) throw new Error("File path or document content required for parsing");
        const parseResult = await callRouteAgent("doc-parser", { filePath, content: document, documentId: documentId || `doc_${Date.now()}` });
        if (parseResult.isError) throw new Error(`Document parsing failed: ${parseResult.content[0].text}`);
        finalResult = JSON.parse(parseResult.content[0].text);
        finalText = `Document parsed successfully. Document ID: ${finalResult.documentId}, Chunks indexed: ${finalResult.chunksIndexed}, Status: ${finalResult.status}`;
        break;

      case "summarize":
        if (!documentId) throw new Error("Document ID required for summarization");
        const summaryResult = await callRouteAgent("summary", { documentId, summaryType: summaryType || "detailed", enableTTS: voiceOutput, roomName });
        if (summaryResult.isError) throw new Error(`Summarization failed: ${summaryResult.content[0].text}`);
        finalResult = JSON.parse(summaryResult.content[0].text);
        finalText = finalResult.summary;
        break;

      case "query":
        if (!userText) throw new Error("Question text required for querying");
        const queryResult = await callRouteAgent("query", { question: userText, documentId, enableTTS: voiceOutput, roomName, topK: topK || 5, includeContext: includeContext || false });
        if (queryResult.isError) throw new Error(`Document query failed: ${queryResult.content[0].text}`);
        finalResult = JSON.parse(queryResult.content[0].text);
        finalText = finalResult.answer;
        break;

      case "research":
      default:
        // If no document, run Exa
        const researchQuery = document ? `${document} ${userText}` : userText;
        console.log("[WORKFLOW] Researching with Exa agent...");
        const researchResult = await callRouteAgent("exa", { query: researchQuery });
        if (researchResult.isError) throw new Error(`Research failed: ${researchResult.content[0].text}`);
        finalText = researchResult.content[0].text;
        finalResult = { research: finalText };
        break;
    }

    // 3️⃣ Optional voice output
    let ttsResult = null;
    if (voiceOutput && finalText && !finalResult.audioUrl) {
      console.log("[WORKFLOW] Generating voice output...");
      const voiceResult = await callRouteAgent("livekit-tts", { text: finalText, roomName });
      if (!voiceResult.isError) ttsResult = voiceResult.content[0].text;
      else console.error("[WORKFLOW] TTS failed:", voiceResult.content[0].text);
    }

    console.log("[WORKFLOW] Workflow completed successfully");
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          action,
          text: finalText,
          voice: ttsResult || finalResult.audioUrl,
          liveKitToken: finalResult.liveKitToken,
          result: finalResult,
          success: true,
        })
      }]
    };

  } catch (error: any) {
    console.error("[WORKFLOW] Workflow error:", error);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ action, text: null, voice: null, success: false, error: error.message })
      }],
      isError: true
    };
  }
});

// ---------------------------
// Additional Tools
// ---------------------------

server.registerTool("listDocuments", {
  title: "List Documents",
  description: "Get all available documents in the system",
  inputSchema: {}
}, async () => {
  try {
    const result = await listDocuments();
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (error: any) {
    return { content: [{ type: "text", text: JSON.stringify({ documents: [], error: error.message }) }], isError: true };
  }
});

server.registerTool("getQuestionSuggestions", {
  title: "Get Question Suggestions",
  description: "Get suggested questions for a document",
  inputSchema: { question: z.string(), documentId: z.string().optional(), limit: z.number().default(3) }
}, async ({ question, documentId, limit }) => {
  try {
    const result = await getSimilarQuestions({ question, documentId, limit });
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (error: any) {
    return { content: [{ type: "text", text: JSON.stringify({ suggestions: [], error: error.message }) }], isError: true };
  }
});

// ---------------------------
// Helper: Internal agent calls
// ---------------------------
async function callRouteAgent(agent: string, input: any) {
  try {
    switch (agent) {
      case "doc-parser": return { content: [{ type: "text", text: await callDocParserAgent(input) }] };
      case "summary": return { content: [{ type: "text", text: await callSummaryAgent(input) }] };
      case "query": return { content: [{ type: "text", text: await callQueryAgent(input) }] };
      case "livekit-stt": return { content: [{ type: "text", text: await callLiveKitSTTAgent(input) }] };
      case "livekit-tts": return { content: [{ type: "text", text: await callLiveKitTTSAgent(input) }] };
      case "exa": return { content: [{ type: "text", text: JSON.stringify(await callExaAgent(input)) }] };
      default:
        console.log(`[INTERNAL] Unknown agent, falling back to Exa`);
        const fallbackResult = await callExaAgent({ query: input });
        return { content: [{ type: "text", text: JSON.stringify(fallbackResult) }] };
    }
  } catch (error: any) {
    return { content: [{ type: "text", text: `Error calling agent ${agent}: ${error.message}` }], isError: true };
  }
}

// ---------------------------
// Agent Implementations
// ---------------------------
async function callDocParserAgent(input: any) {
  try { return JSON.stringify(await parseAndEmbedDoc(input.filePath, input.documentId || `doc_${Date.now()}`)); }
  catch (e: any) { return JSON.stringify({ success: false, error: e.message }); }
}

async function callSummaryAgent(input: any) {
  try { return JSON.stringify(await summarizeDocument(input.documentId, input.summaryType || "detailed", input.enableTTS || false, input.roomName)); }
  catch (e: any) { return JSON.stringify({ success: false, error: e.message }); }
}

async function callQueryAgent(input: any) {
  try {
    const result = input.documentId
      ? await queryDocument({ question: input.question, documentId: input.documentId, topK: input.topK, includeContext: input.includeContext })
      : await queryAllDocuments({ question: input.question, topK: input.topK, includeContext: input.includeContext });
    return JSON.stringify(result);
  } catch (e: any) { return JSON.stringify({ success: false, error: e.message }); }
}

async function callLiveKitSTTAgent(input: any) { return `[MOCK] STT transcription: ${JSON.stringify(input)}`; }
async function callLiveKitTTSAgent(input: any) { return `[MOCK] TTS voice output: ${JSON.stringify(input)}`; }

async function callExaAgent(input: any) {
  try {
    const response = await fetch("http://localhost:8000/api/v1/agents/exa/execute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: input.query || input }) });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (e: any) { return `[MOCK] Exa research result: ${JSON.stringify(input)}`; }
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
    console.log("[SERVER] Available tools: route, handleRequest, listDocuments, getQuestionSuggestions");
    console.log("[SERVER] Supported agents: doc-parser, summary, query, livekit-stt, livekit-tts, exa");
  } catch (error: any) {
    console.error("[SERVER] Error starting MCP Orchestrator:", error);
  }
}

startServer();
