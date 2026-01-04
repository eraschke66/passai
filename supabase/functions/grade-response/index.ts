/**
 * Grade Response Edge Function
 *
 * Grades student answers for short-answer and essay questions using AI.
 * Uses Anthropic Claude for semantic understanding and fair grading.
 *
 * @endpoint POST /functions/v1/grade-response
 * @auth Required (JWT token)
 *
 * @body {
 *   questionId: string,              // Question to grade
 *   questionType: "short-answer" | "essay",
 *   question: string,                // Question text
 *   modelAnswer: string,             // Correct answer
 *   studentAnswer: string,           // Student's response
 *   rubric?: string,                 // Optional grading rubric
 *   context?: {
 *     topic?: string,
 *     difficulty?: string
 *   }
 * }
 *
 * @returns {
 *   score: number,                   // 0-100
 *   isCorrect: boolean,              // true if score >= 70
 *   feedback: string,                // Detailed feedback
 *   keyPoints?: {
 *     captured: string[],
 *     missed: string[]
 *   },
 *   rubricBreakdown?: Array<{        // For essay questions
 *     criterion: string,
 *     score: number,
 *     maxScore: number,
 *     feedback: string
 *   }>,
 *   usage: {
 *     input_tokens: number,
 *     output_tokens: number
 *   }
 * }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, validateAuth } from "./auth.ts";
import { gradeAnswer } from "./anthropic.ts";
import { fetchQuestion, fetchSubjectForQuestion } from "./grading.ts";

interface GradeRequestBody {
    questionId: string;
    questionType: "short-answer" | "essay";
    question: string;
    modelAnswer: string;
    studentAnswer: string;
    rubric?: string;
    context?: {
        topic?: string;
        difficulty?: string;
    };
}

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Validate authentication
        console.log("🔐 Validating auth...");
        const { user, supabaseClient } = await validateAuth(req);
        console.log(`✅ User authenticated: ${user.id}`);

        // Parse request body
        const body: GradeRequestBody = await req.json();

        // Validate required fields
        if (!body.questionId || !body.studentAnswer || !body.modelAnswer) {
            return new Response(
                JSON.stringify({
                    error:
                        "Missing required fields: questionId, studentAnswer, modelAnswer",
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

        // Validate question type
        if (
            body.questionType !== "short-answer" &&
            body.questionType !== "essay"
        ) {
            return new Response(
                JSON.stringify({
                    error:
                        'Invalid questionType. Must be "short-answer" or "essay"',
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

        // Fetch question from database (validates access)
        const question = await fetchQuestion(
            supabaseClient,
            body.questionId,
            user.id,
        );

        // Get subject grading rubric if available and not provided
        let rubric = body.rubric;
        if (!rubric && body.questionType === "essay") {
            const subject = await fetchSubjectForQuestion(
                supabaseClient,
                question.quiz_id,
            );
            rubric = subject?.grading_rubric || undefined;
        }

        // Grade the answer with Claude
        const gradingResult = await gradeAnswer({
            questionType: body.questionType,
            question: body.question,
            modelAnswer: body.modelAnswer,
            studentAnswer: body.studentAnswer,
            rubric: rubric,
            context: {
                topic: body.context?.topic || question.topic,
                difficulty: body.context?.difficulty || question.difficulty,
            },
        });

        console.log(
            `✅ Successfully graded question ${body.questionId}: ${gradingResult.score}/100`,
        );

        return new Response(JSON.stringify(gradingResult), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("❌ Error in grade-response:", error);

        // Handle specific error types
        if (error.message.includes("Missing authorization")) {
            return new Response(
                JSON.stringify({ error: "Authentication required" }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (error.message.includes("Unauthorized")) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized access to this question",
                }),
                {
                    status: 403,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (error.message.includes("not found")) {
            return new Response(
                JSON.stringify({ error: "Question not found" }),
                {
                    status: 404,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (error.message.includes("ANTHROPIC_API_KEY")) {
            return new Response(
                JSON.stringify({ error: "AI service not configured" }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Generic error
        return new Response(
            JSON.stringify({
                error: "Failed to grade answer",
                details: error.message,
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});
