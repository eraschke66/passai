import { supabase } from "@/lib/supabase/client";
import type { QuizSettings } from "../types/quiz";

/**
 * Quiz Generation Service
 * Handles AI-powered quiz generation via Edge Functions
 *
 * The Edge Function handles all operations:
 * - User authentication
 * - Subject & material fetching
 * - AI quiz generation (Anthropic Claude)
 * - Database operations (quiz creation, question insertion, material linking)
 */

/**
 * Generate a new quiz using AI
 *
 * This function calls the Edge Function which handles the entire quiz generation
 * pipeline server-side. The Edge Function will:
 * 1. Authenticate the user via the auth token
 * 2. Fetch subject data (with teacher layer customization)
 * 3. Fetch and process study materials
 * 4. Call Anthropic API to generate questions
 * 5. Create quiz record in database
 * 6. Insert questions with proper foreign keys
 * 7. Link materials to the quiz
 *
 * @param subjectId - Subject for quiz generation
 * @param materialIds - Study materials to generate questions from
 * @param settings - Quiz configuration (count, difficulty, etc.)
 * @returns Quiz metadata (ID, title, question count)
 */
export const generateQuiz = async (
    subjectId: string,
    materialIds: string[],
    settings: QuizSettings,
): Promise<{ quizId: string; title: string; questionsCount: number }> => {
    console.log("🚀 Calling generate-quiz Edge Function...");
    console.log("📝 Parameters:", {
        subjectId,
        materialCount: materialIds.length,
        questionCount: settings.questionCount,
        difficulty: settings.difficulty,
    });

    const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: {
            subjectId,
            materialIds,
            settings,
        },
    });

    if (error) {
        console.error("❌ Edge Function error:", error);
        throw new Error(
            error.message || "Failed to generate quiz. Please try again.",
        );
    }

    if (!data || !data.quizId) {
        console.error("❌ Invalid response from Edge Function:", data);
        throw new Error(
            "Invalid response from quiz generation service. Please try again.",
        );
    }

    console.log("✅ Quiz generated successfully:", {
        quizId: data.quizId,
        title: data.title,
        questionsCount: data.questionsCount,
    });

    // Log usage stats if available
    if (data.usage) {
        console.log("📊 AI usage:", data.usage);
    }

    return {
        quizId: data.quizId,
        title: data.title,
        questionsCount: data.questionsCount,
    };
};
