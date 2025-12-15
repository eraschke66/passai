/**
 * Server-side OpenAI client configuration
 * NO dangerouslyAllowBrowser flag - this runs on the server!
 */

import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { OpenAIError } from "./errors.ts";

let openaiClient: OpenAI | null = null;

/**
 * Get or create OpenAI client instance
 * Throws error if API key is not configured
 */
export function getOpenAIClient(): OpenAI {
    if (openaiClient) {
        return openaiClient;
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
        throw new OpenAIError(
            "OPENAI_API_KEY not configured in Edge Functions secrets",
        );
    }

    openaiClient = new OpenAI({
        apiKey,
        // No dangerouslyAllowBrowser needed - we're on the server!
    });

    return openaiClient;
}

/**
 * Make a chat completion request with error handling
 */
export async function createChatCompletion(
    params: OpenAI.ChatCompletionCreateParams,
): Promise<OpenAI.ChatCompletion> {
    const client = getOpenAIClient();

    try {
        const completion = await client.chat.completions.create(params);
        return completion;
    } catch (error) {
        console.error("OpenAI API Error:", error);

        if (error instanceof Error) {
            throw new OpenAIError(`OpenAI API failed: ${error.message}`);
        }

        throw new OpenAIError("OpenAI API request failed");
    }
}

/**
 * Parse JSON response from OpenAI
 * Handles cases where response might not be valid JSON
 */
export function parseOpenAIJsonResponse<T>(
    content: string | null | undefined,
    defaultValue: T,
): T {
    if (!content) {
        console.warn("Empty response from OpenAI");
        return defaultValue;
    }

    try {
        return JSON.parse(content) as T;
    } catch (error) {
        console.error("Failed to parse OpenAI response as JSON:", error);
        console.error("Response content:", content);
        return defaultValue;
    }
}
