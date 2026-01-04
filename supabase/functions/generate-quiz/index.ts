/**
 * Generate Quiz Edge Function - Main Handler
 *
 * Clean, modular implementation with separated concerns:
 * - Auth validation
 * - Database operations
 * - AI generation
 * - Prompt building
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, validateAuth } from "./auth.ts";
import type { AuthResult } from "./auth.ts";
import {
  createQuiz,
  fetchMaterials,
  fetchSubject,
  insertQuestions,
  linkMaterialsToQuiz,
  prepareMaterialContent,
} from "./database.ts";
import type { QuizSettings } from "./database.ts";
import { generateQuestions } from "./anthropic.ts";
import { buildCurriculumAlignedPrompt, buildUserPrompt } from "./prompts.ts";

// Request/Response types for this endpoint
export interface RequestBody {
  subjectId: string;
  materialIds: string[];
  settings: QuizSettings;
}

export interface QuizResponse {
  quizId: string;
  title: string;
  questionsCount: number;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🎯 Generate quiz function called");

    // 1. Authenticate user
    const { user, supabaseClient }: AuthResult = await validateAuth(req);
    console.log("✅ User authenticated:", user.id);

    // 2. Parse request body
    const body: RequestBody = await req.json();
    const { subjectId, materialIds, settings } = body;

    console.log("📋 Request:", {
      subjectId,
      materialCount: materialIds.length,
      questionCount: settings.questionCount,
    });

    // 3. Validate input
    if (!subjectId || !materialIds || materialIds.length === 0) {
      throw new Error("Missing required fields: subjectId, materialIds");
    }

    // 4. Fetch subject and materials
    const subject = await fetchSubject(supabaseClient, subjectId, user.id);
    const materials = await fetchMaterials(
      supabaseClient,
      materialIds,
      user.id,
    );
    const materialContent = prepareMaterialContent(materials);

    // 5. Build prompts with curriculum alignment
    const systemPrompt = buildCurriculumAlignedPrompt(
      settings.subjectName,
      subject.exam_board,
      subject.question_style || "multiple_choice",
      subject.teacher_emphasis,
      subject.grading_rubric,
    );

    const userPrompt = buildUserPrompt(
      materialContent,
      settings,
      subject.exam_board,
    );

    // 6. Generate questions using AI
    const { questions, usage } = await generateQuestions(
      systemPrompt,
      userPrompt,
    );

    // 7. Save to database
    const { quizId, title } = await createQuiz(
      supabaseClient,
      user.id,
      subjectId,
      subject.name,
      settings,
      materialIds.length,
      questions.length,
    );

    await insertQuestions(supabaseClient, quizId, questions);
    await linkMaterialsToQuiz(supabaseClient, quizId, materialIds);

    // 8. Return success response
    const response: QuizResponse = {
      quizId,
      title,
      questionsCount: questions.length,
      usage,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Generate quiz error:", error);

    // Determine appropriate error message and status code
    let errorMessage = "Failed to generate quiz";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      if (
        errorMessage.includes("authentication") ||
        errorMessage.includes("authorization")
      ) {
        statusCode = 401;
      } else if (
        errorMessage.includes("not found") ||
        errorMessage.includes("access denied")
      ) {
        statusCode = 404;
      } else if (errorMessage.includes("Missing required fields")) {
        statusCode = 400;
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
