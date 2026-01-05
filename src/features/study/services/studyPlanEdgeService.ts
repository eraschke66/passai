/**
 * Study Plan Edge Function Service
 * Calls the generate-study-plan Edge Function with garden metaphor support
 */

import { supabase } from "@/lib/supabase/client";

/**
 * Garden stage types from Edge Function
 */
export type GardenStage = "🌱" | "🌿" | "🌻" | "🌳";

/**
 * Topic with garden metadata from Edge Function
 */
export type TopicWithGarden = {
    name: string;
    gardenStage: GardenStage;
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
    bktData?: {
        p_known: number;
        p_learned: number;
        p_forgot: number;
        mastery_level: number;
    };
};

/**
 * Study plan response from Edge Function
 */
export type EdgeStudyPlanResponse = {
    gardenHealth: number;
    encouragement: string;
    topics: TopicWithGarden[];
};

/**
 * Full response with metadata
 */
export type GenerateStudyPlanEdgeResponse = {
    success: boolean;
    studyPlan: EdgeStudyPlanResponse;
    metadata: {
        subjectId: string;
        subjectName: string;
        quizAttemptId: string;
        gardenHealth: number;
        currentPassChance: number;
        testDate: string | null;
        availableHoursPerWeek: number;
        topicsAnalyzed: number;
        generatedAt: string;
    };
};

/**
 * Generate a study plan using the Edge Function with garden metaphor
 */
export const generateStudyPlanEdge = async (settings: {
    subjectId: string;
    quizAttemptId: string;
    testDate?: string;
    availableHoursPerWeek?: number;
}): Promise<GenerateStudyPlanEdgeResponse> => {
    try {
        // Get the current session
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            throw new Error("User not authenticated");
        }

        // Call the Edge Function
        const { data, error } = await supabase.functions.invoke(
            "generate-study-plan",
            {
                body: {
                    subjectId: settings.subjectId,
                    quizAttemptId: settings.quizAttemptId,
                    testDate: settings.testDate || null,
                    availableHoursPerWeek: settings.availableHoursPerWeek || 5,
                },
            },
        );

        if (error) {
            console.error("Edge Function error:", error);
            throw new Error(
                `Failed to generate study plan: ${
                    error.message || "Unknown error"
                }`,
            );
        }

        if (!data || !data.success) {
            throw new Error(data?.error || "Failed to generate study plan");
        }

        return data;
    } catch (error) {
        console.error(
            "Error calling generate-study-plan Edge Function:",
            error,
        );
        throw error;
    }
};

/**
 * Convert Edge Function study plan to database format
 * Maps garden-themed topics to the studyy_plans database structure
 */
export const convertEdgePlanToDatabaseFormat = (
    edgeResponse: GenerateStudyPlanEdgeResponse,
    subjectName: string,
): {
    title: string;
    description: string;
    total_hours: number;
    projected_pass_chance: number;
    topics: Array<{
        title: string;
        description: string;
        priority: "high" | "medium" | "low";
        total_time_minutes: number;
        tasks: Array<{
            title: string;
            description: string;
            task_type: "review" | "practice" | "reading" | "exercise" | "video";
            estimated_time_minutes: number;
        }>;
    }>;
} => {
    const { studyPlan, metadata } = edgeResponse;

    // Calculate total time across all topics
    const totalMinutes = studyPlan.topics.reduce(
        (sum, topic) =>
            sum +
            topic.recommendations.reduce(
                (topicSum, rec) => topicSum + rec.timeMinutes,
                0,
            ),
        0,
    );
    const totalHours = Math.ceil(totalMinutes / 60);

    // Map garden stages to priority
    const gardenStageToPriority = (
        stage: GardenStage,
    ): "high" | "medium" | "low" => {
        if (stage === "🌱") return "high"; // Seedlings need most attention
        if (stage === "🌿") return "medium"; // Growing plants need regular care
        return "low"; // Blooming and thriving plants are stable
    };

    // Convert topics to database format
    const topics = studyPlan.topics.map((topic) => ({
        title: topic.name,
        description: topic.encouragement,
        priority: gardenStageToPriority(topic.gardenStage),
        total_time_minutes: topic.recommendations.reduce(
            (sum, rec) => sum + rec.timeMinutes,
            0,
        ),
        tasks: topic.recommendations.map((rec) => ({
            title: rec.title,
            description: rec.description,
            task_type: rec.taskType,
            estimated_time_minutes: rec.timeMinutes,
        })),
    }));

    return {
        title: `${subjectName} Study Plan - Garden Growing 🌱`,
        description: studyPlan.encouragement,
        total_hours: totalHours,
        projected_pass_chance: metadata.currentPassChance,
        topics,
    };
};
