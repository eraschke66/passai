/**
 * Database operations for grade-response Edge Function
 * Handles fetching question details and validating access
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface Question {
    id: string;
    question: string;
    type: string;
    correct_answer: string;
    topic?: string;
    difficulty?: string;
    quiz_id: string;
    user_id: string; // For RLS validation
}

/**
 * Fetch question details and validate user has access to it
 */
export async function fetchQuestion(
    supabase: SupabaseClient,
    questionId: string,
    userId: string,
): Promise<Question> {
    console.log(`📖 Fetching question ${questionId}...`);

    const { data: question, error } = await supabase
        .from("questions")
        .select(
            `
      id,
      question,
      type,
      correct_answer,
      topic,
      difficulty,
      quiz_id,
      quizzes!inner(user_id)
    `,
        )
        .eq("id", questionId)
        .single();

    if (error) {
        console.error("❌ Database error:", error);
        throw new Error(`Failed to fetch question: ${error.message}`);
    }

    if (!question) {
        throw new Error("Question not found");
    }

    // Validate user owns this quiz
    const quizUserId = (question as any).quizzes?.user_id;
    if (quizUserId !== userId) {
        throw new Error("Unauthorized: You don't have access to this question");
    }

    console.log(`✅ Question fetched: ${question.type}`);

    return {
        id: question.id,
        question: question.question,
        type: question.type,
        correct_answer: question.correct_answer,
        topic: question.topic,
        difficulty: question.difficulty,
        quiz_id: question.quiz_id,
        user_id: quizUserId,
    };
}

/**
 * Fetch subject details for additional grading context
 */
export async function fetchSubjectForQuestion(
    supabase: SupabaseClient,
    quizId: string,
): Promise<{ name: string; grading_rubric?: string } | null> {
    console.log(`📚 Fetching subject for quiz ${quizId}...`);

    const { data: quiz, error } = await supabase
        .from("quizzes")
        .select(
            `
      subject_id,
      subjects!inner(name, grading_rubric)
    `,
        )
        .eq("id", quizId)
        .single();

    if (error || !quiz) {
        console.warn("⚠️ Could not fetch subject:", error?.message);
        return null;
    }

    const subject = (quiz as any).subjects;
    console.log(`✅ Subject: ${subject.name}`);

    return {
        name: subject.name,
        grading_rubric: subject.grading_rubric,
    };
}
