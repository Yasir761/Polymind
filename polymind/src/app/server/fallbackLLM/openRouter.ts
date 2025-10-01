/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";


const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""; // set in .env
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";


export async function llmWithFallback(
  prompt: string,
  primaryCall: () => Promise<string>,
  modelOverride?: string
): Promise<string> {
  try {
    return await primaryCall();
  } catch (error: any) {
    console.warn(
      "[LLM] Primary call failed, using OpenRouter fallback:",
      (typeof error === "object" && error !== null && "message" in error) ? (error as any).message : error
    );
    return await callOpenRouter(prompt, modelOverride);
  }
}

/**
 * Calls OpenRouter for LLM completions.
 * @param prompt string
 * @param model string
 * @returns content string
 */
export async function callOpenRouter(prompt: string, model = "meta-llama/llama-3-70b-instruct"): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error("No OpenRouter API key provided");

  const resp = await axios.post(
    OPENROUTER_URL,
    {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.1
    },
    {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` }
    }
  );
  return resp.data.choices[0].message.content;
}
