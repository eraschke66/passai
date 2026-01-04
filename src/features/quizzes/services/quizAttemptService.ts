import { supabase } from "@/lib/supabase/client";
import type { QuestionResult, QuizAttempt } from "../types/quiz";

/**
 * Quiz Attempt Service
 * Handles quiz attempt lifecycle, user answers, and resume functionality
 */

/**
 * Create a new quiz attempt for a user
 *
 * @param userId - User taking the quiz
 * @param quizId - Quiz being attempted
 * @returns Created quiz attempt data
 */
export const createQuizAttempt = async (userId: string, quizId: string) => {
    console.log("📝 Creating quiz attempt:", { userId, quizId });

    // First, get the quiz to find total_questions
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("questions_count")
        .eq("id", quizId)
        .single();

    if (quizError) {
        console.error("❌ Error fetching quiz:", quizError);
        throw quizError;
    }

    // Get existing attempts to calculate attempt_number
    const { data: existingAttempts, error: attemptsError } = await supabase
        .from("quiz_attempts")
        .select("attempt_number")
        .eq("quiz_id", quizId)
        .eq("user_id", userId)
        .order("attempt_number", { ascending: false })
        .limit(1);

    if (attemptsError) {
        console.error("❌ Error fetching attempts:", attemptsError);
        throw attemptsError;
    }

    const attemptNumber = existingAttempts && existingAttempts.length > 0
        ? existingAttempts[0].attempt_number + 1
        : 1;

    const quizAttempt = {
        quiz_id: quizId,
        user_id: userId,
        attempt_number: attemptNumber,
        time_spent: 0,
        score: 0,
        status: "in-progress",
        correct_answers: 0,
        total_questions: quiz?.questions_count || 0,
    };

    console.log("📤 Inserting quiz attempt:", quizAttempt);

    const { data: attemptData, error: attemptError } = await supabase
        .from("quiz_attempts")
        .insert(quizAttempt)
        .select("*")
        .single();

    if (attemptError) {
        console.error("❌ Error creating attempt:", attemptError);
        throw attemptError;
    }

    console.log("✅ Quiz attempt created:", attemptData);

    // Update the quiz status to in-progress
    const { error: updateError } = await supabase
        .from("quizzes")
        .update({ status: "in-progress" })
        .eq("id", quizId);

    if (updateError) {
        console.error("⚠️ Error updating quiz status:", updateError);
        // Don't throw - attempt was created successfully
    } else {
        console.log("✅ Quiz status updated to in-progress");
    }

    return attemptData;
};

/**
 * Get a single quiz attempt by ID
 *
 * @param attemptId - ID of the attempt to fetch
 * @returns Quiz attempt data or null if not found
 */
export const getAttemptById = async (
    attemptId: string,
): Promise<QuizAttempt | null> => {
    console.log("🔍 Fetching attempt by ID:", attemptId);

    const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("id", attemptId)
        .maybeSingle();

    if (error) {
        console.error("❌ Error fetching attempt:", error);
        throw error;
    }

    console.log("✅ Attempt fetched:", data);
    return data;
};

/**
 * Get active (in-progress) attempt for a quiz
 * Used for resume functionality
 *
 * @param userId - User ID
 * @param quizId - Quiz ID
 * @returns Active attempt or null if none exists
 */
export const getActiveAttempt = async (
    userId: string,
    quizId: string,
): Promise<QuizAttempt | null> => {
    console.log("🔍 Checking for active attempt:", { userId, quizId });

    const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("quiz_id", quizId)
        .eq("status", "in-progress")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("❌ Error fetching active attempt:", error);
        throw error;
    }

    console.log("✅ Active attempt:", data);
    return data;
};

/**
 * Get user answers for an attempt (for resume functionality)
 *
 * @param attemptId - Attempt ID
 * @returns Array of question results
 */
export const getAttemptAnswers = async (
    attemptId: string,
): Promise<QuestionResult[]> => {
    console.log("🔍 Fetching answers for attempt:", attemptId);

    const { data, error } = await supabase
        .from("user_answers")
        .select("*")
        .eq("attempt_id", attemptId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("❌ Error fetching attempt answers:", error);
        throw error;
    }

    // Transform to QuestionResult format
    const results: QuestionResult[] = data?.map((answer) => ({
        questionId: answer.question_id,
        userAnswer: answer.user_answer || "",
        correctAnswer: "", // Will be fetched from questions
        isCorrect: answer.is_correct,
        timeSpent: answer.time_spent,
        wasAnswered: answer.user_answer !== null,
        feedback: answer.feedback as "thumbs-up" | "thumbs-down" | undefined,
    })) || [];

    console.log("✅ Answers fetched:", results.length);
    return results;
};

/**
 * Save user answer and update progress
 *
 * @param attemptId - Current attempt ID
 * @param questionId - Question being answered
 * @param userAnswer - User's answer
 * @param isCorrect - Whether answer is correct
 * @param timeSpent - Time spent on question (seconds)
 * @param currentQuestionIndex - Current question index for progress tracking
 */
export const saveUserAnswer = async (
    attemptId: string,
    questionId: string,
    userAnswer: string,
    isCorrect: boolean,
    timeSpent: number,
    currentQuestionIndex: number,
): Promise<void> => {
    console.log("💾 Saving user answer:", {
        attemptId,
        questionId,
        currentQuestionIndex,
    });

    // Save the answer
    const { error: answerError } = await supabase.from("user_answers").upsert(
        {
            attempt_id: attemptId,
            question_id: questionId,
            user_answer: userAnswer,
            is_correct: isCorrect,
            time_spent: timeSpent,
        },
        {
            onConflict: "attempt_id,question_id",
        },
    );

    if (answerError) {
        console.error("❌ Error saving answer:", answerError);
        throw answerError;
    }

    // Update attempt progress
    const { error: attemptError } = await supabase
        .from("quiz_attempts")
        .update({
            current_question_index: currentQuestionIndex,
        })
        .eq("id", attemptId);

    if (attemptError) {
        console.error("❌ Error updating attempt progress:", attemptError);
        throw attemptError;
    }

    console.log("✅ Answer saved and progress updated");
};
