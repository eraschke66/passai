/**
 * Study Plan Generation Edge Function
 *
 * Generates personalized study plans using:
 * - BKT (Bayesian Knowledge Tracing) mastery data
 * - Recent quiz performance
 * - Garden metaphor for warm, encouraging guidance
 *
 * Integrates with Anthropic Claude for AI-powered recommendations
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, validateAuth } from "./auth.ts";
import { callAnthropic, type StudyPlanAIResponse } from "./anthropic.ts";
import {
    analyzeQuizPerformance,
    calculateTimeToNextStage,
    fetchQuizAttempt,
    fetchSubject,
    fetchTopicMastery,
    getMasteryStage,
} from "./database.ts";
import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts";

/**
 * Request body shape
 */
interface GenerateStudyPlanRequest {
    subjectId: string;
    quizAttemptId: string;
    testDate?: string;
    availableHoursPerWeek?: number;
}

/**
 * Main Edge Function handler
 */
serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Validate authentication
        const authResult = await validateAuth(req);
        if (!authResult.success || !authResult.userId) {
            return new Response(
                JSON.stringify({ error: authResult.error || "Unauthorized" }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const userId = authResult.userId;

        // 2. Parse request body
        const body: GenerateStudyPlanRequest = await req.json();
        const {
            subjectId,
            quizAttemptId,
            testDate = null,
            availableHoursPerWeek = 5,
        } = body;

        if (!subjectId || !quizAttemptId) {
            return new Response(
                JSON.stringify({
                    error: "subjectId and quizAttemptId are required",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        console.log("Generating study plan", {
            userId,
            subjectId,
            quizAttemptId,
            testDate,
            availableHoursPerWeek,
        });

        // 3. Fetch subject details
        const subject = await fetchSubject(
            authResult.supabase,
            userId,
            subjectId,
        );
        if (!subject) {
            return new Response(
                JSON.stringify({ error: "Subject not found" }),
                {
                    status: 404,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // 4. Fetch topic mastery data (BKT)
        const topicMastery = await fetchTopicMastery(
            authResult.supabase,
            userId,
            subjectId,
        );

        console.log(`Found ${topicMastery.length} topics with mastery data`);

        // 5. Fetch quiz attempt details
        const quizAttempt = await fetchQuizAttempt(
            authResult.supabase,
            userId,
            quizAttemptId,
        );

        if (!quizAttempt) {
            return new Response(
                JSON.stringify({ error: "Quiz attempt not found" }),
                {
                    status: 404,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // 6. Analyze quiz performance by topic
        const quizPerformance = analyzeQuizPerformance(quizAttempt);

        console.log("Quiz performance analysis", {
            weakTopics: quizPerformance.weakTopics.length,
            strongTopics: quizPerformance.strongTopics.length,
            totalTopics: quizPerformance.byTopic.size,
        });

        // 7. Calculate current pass chance (simple average for now)
        const currentPassChance = topicMastery.length > 0
            ? Math.round(
                topicMastery.reduce((sum, t) => sum + t.mastery_level, 0) /
                    topicMastery.length,
            )
            : quizAttempt.score;

        // 8. Build prompts with garden metaphor
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(
            {
                subjectName: subject.name,
                testDate,
                availableHoursPerWeek,
                currentPassChance,
            },
            topicMastery,
            quizPerformance,
            {
                score: quizAttempt.score,
                correct_answers: quizAttempt.correct_answers,
                total_questions: quizAttempt.total_questions,
            },
        );

        // 9. Call Anthropic for study plan generation
        console.log("Calling Anthropic for study plan generation");
        const aiResponse = await callAnthropic(systemPrompt, userPrompt);

        if (!aiResponse.success || !aiResponse.studyPlan) {
            console.error("AI generation failed", aiResponse.error);
            return new Response(
                JSON.stringify({
                    error: aiResponse.error || "Failed to generate study plan",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const studyPlan = aiResponse.studyPlan;

        // 10. Enhance study plan with BKT mastery data
        const enhancedTopics = studyPlan.topics.map((topic) => {
            // Find matching mastery data
            const mastery = topicMastery.find((m) =>
                m.topic_name === topic.name
            );

            if (mastery) {
                return {
                    ...topic,
                    masteryLevel: mastery.mastery_level,
                    gardenStage: getMasteryStage(mastery.mastery_level),
                    timeToNextStage: calculateTimeToNextStage(
                        mastery.mastery_level,
                    ),
                    bktData: {
                        p_known: mastery.p_known,
                        p_learned: mastery.p_learned,
                        p_forgot: mastery.p_forgot,
                        mastery_level: mastery.mastery_level,
                    },
                };
            }

            // If no mastery data, use quiz performance
            const perf = quizPerformance.byTopic.get(topic.name);
            if (perf) {
                return {
                    ...topic,
                    masteryLevel: perf.percentage,
                    gardenStage: getMasteryStage(perf.percentage),
                    timeToNextStage: calculateTimeToNextStage(perf.percentage),
                };
            }

            // Default for new topics
            return {
                ...topic,
                masteryLevel: 30,
                gardenStage: "🌱" as const,
                timeToNextStage: 45,
            };
        });

        // 11. Build final response with garden metadata
        const response = {
            success: true,
            studyPlan: {
                ...studyPlan,
                topics: enhancedTopics,
            },
            metadata: {
                subjectId,
                subjectName: subject.name,
                quizAttemptId,
                gardenHealth: studyPlan.gardenHealth,
                currentPassChance,
                testDate,
                availableHoursPerWeek,
                topicsAnalyzed: enhancedTopics.length,
                generatedAt: new Date().toISOString(),
            },
        };

        console.log("Study plan generated successfully", {
            gardenHealth: studyPlan.gardenHealth,
            topicsCount: enhancedTopics.length,
        });

        return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error generating study plan:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error
                    ? error.message
                    : "Internal server error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});
