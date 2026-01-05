/**
 * Anthropic AI client for study plan generation
 */

import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.20.9";

export async function createAnthropicClient(): Promise<Anthropic> {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }

    return new Anthropic({ apiKey });
}

export interface StudyPlanAIResponse {
    gardenHealth: number;
    encouragement: string;
    topics: Array<{
        name: string;
        gardenStage: "🌱" | "🌿" | "🌻" | "🌳";
        masteryLevel: number;
        encouragement: string;
        timeToNextStage: number;
        recommendations: Array<{
            title: string;
            description: string;
            taskType: "review" | "practice" | "reading" | "exercise" | "video";
            timeMinutes: number;
            outcome: string;
        }>;
    }>;
}

export async function generateStudyPlanWithAI(
    systemPrompt: string,
    userPrompt: string,
): Promise<StudyPlanAIResponse> {
    const client = await createAnthropicClient();

    console.log("🤖 Calling Anthropic API for study plan generation...");

    const response = await client.messages.create({
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

    // Extract content
    const content = response.content[0];
    if (content.type !== "text") {
        throw new Error("Unexpected response type from Anthropic");
    }

    // Parse JSON response
    let studyPlan: StudyPlanAIResponse;
    try {
        studyPlan = JSON.parse(content.text);
    } catch (error) {
        console.error("Failed to parse AI response:", content.text);
        throw new Error("AI returned invalid JSON response");
    }

    // Log usage
    console.log("📊 AI Usage:", {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
    });

    return studyPlan;
}
