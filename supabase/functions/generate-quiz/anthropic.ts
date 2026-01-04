/**
 * Anthropic Claude API integration for quiz generation
 */

import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.20.9";
import type { GeneratedQuestion } from "./database.ts";

function getAnthropicClient(): Anthropic {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  return new Anthropic({ apiKey });
}

export interface GenerationResult {
  questions: GeneratedQuestion[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export async function generateQuestions(
  systemPrompt: string,
  userPrompt: string
): Promise<GenerationResult> {
  console.log("🤖 Calling Anthropic Claude...");

  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4096,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const responseText =
    message.content[0]?.type === "text" ? message.content[0].text : null;

  if (!responseText) {
    throw new Error("Empty response from Claude");
  }

  const jsonResponse = JSON.parse(responseText);
  const questions: GeneratedQuestion[] = jsonResponse.questions || [];

  console.log("✅ Generated questions:", questions.length);

  // Validate that all questions have concepts (for BKT tracking)
  questions.forEach((q) => {
    if (!q.concept) {
      q.concept = q.topic; // Fallback to topic if concept missing
    }
  });

  return {
    questions,
    usage: {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    },
  };
}
