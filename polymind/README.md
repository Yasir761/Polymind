# Polymind 🧠
A multi-agent workspace assistant for remote teams.

## Tech Stack
- **Meta LLaMA** → Core AI for parsing, summarizing, Q&A.
- **Cerebras** → Optimized inference for speed & efficiency.
- **Docker MCP Toolkit + Gateway** → Containerized agents, orchestrated seamlessly.
- **ChromaDB** → Memory & semantic search.
- **Exa** → External research enrichment.
- **LiveKit** → Voice-first agent.

## Agents
- Doc Parser Agent 📄
- Summarizer Agent ✍️
- Query Agent 🔍
- Research Agent 🌐
- Voice Agent 🎤

## How It Works
1. Upload docs → stored in **S3 + ChromaDB**.
2. Agents process input in parallel.
3. Cerebras + LLaMA optimize output.
4. Orchestrator (via MCP) routes queries across agents.
5. Final answer delivered via **chat UI** or **voice**.


