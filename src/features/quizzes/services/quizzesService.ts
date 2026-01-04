import { supabase } from "@/lib/supabase/client";
import type {
  MaterialWithSubject,
  Question,
  QuestionResult,
  QuizAttempt,
  QuizWithSubject,
  Subject,
} from "../types/quiz";

/**
 * Quizzes Service
 * Core CRUD operations for quizzes, subjects, materials, and questions
 *
 * For specialized operations, see:
 * - quizGenerationService.ts - AI quiz generation
 * - quizAttemptService.ts - Quiz attempts and user answers
 * - quizCompletionService.ts - Quiz completion and BKT mastery
 */

// ============================================================================
// Subjects
// ============================================================================

export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) throw error;
  return data || [];
};

// ============================================================================
// Quizzes
// ============================================================================

/**
 * Get all quizzes with their subjects
 * Note: RLS policies handle per-user filtering
 */
export const getQuizzes = async (): Promise<QuizWithSubject[]> => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, subjects!subject_id (name, color)");
  if (error) throw error;

  // Flatten the joined data to match Quiz type
  return (data || []).map((quiz) => ({
    ...quiz,
    subject: quiz.subjects?.name || "",
    subject_color: quiz.subjects?.color || "",
  }));
};

/**
 * Get a single quiz by ID with subject details
 */
export const getQuiz = async (
  quizId: string,
): Promise<QuizWithSubject | null> => {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, subjects!subject_id (name, color)")
    .eq("id", quizId)
    .single();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    subject: data.subjects?.name || "",
    subject_color: data.subjects?.color || "",
  };
};

/**
 * Get all attempts for a specific quiz
 */
export const getQuizAttempts = async (
  quizId: string,
): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .order("attempt_number", { ascending: false });
  if (error) throw error;
  return data || [];
};

// ============================================================================
// Materials
// ============================================================================

export const getMaterials = async (): Promise<MaterialWithSubject[]> => {
  const { data, error } = await supabase
    .from("study_materials")
    .select("*, subjects!subject_id (name)");
  if (error) throw error;
  return (data || []).map((mat) => ({
    ...mat,
    subject: mat.subjects?.name || "",
  }));
};

/**
 * Get materials that were used to generate a specific quiz
 * Uses the quiz_materials junction table to return only materials linked to this quiz
 */
export const getQuizMaterials = async (
  quizId: string,
): Promise<MaterialWithSubject[]> => {
  const { data, error } = await supabase
    .from("quiz_materials")
    .select(
      `
      study_materials (
        *,
        subjects!subject_id (name)
      )
    `,
    )
    .eq("quiz_id", quizId);

  if (error) {
    console.error("❌ Error fetching quiz materials:", error);
    throw error;
  }

  // Transform the nested data structure
  return (data || [])
    .map((item) => {
      const material = item.study_materials as any;
      if (!material) return null;
      return {
        ...material,
        subject: material.subjects?.name || "",
      };
    })
    .filter((m): m is MaterialWithSubject => m !== null);
};

// ============================================================================
// Questions
// ============================================================================

/**
 * Get all questions for a given quiz
 */
export const getQuestions = async (quizId: string): Promise<Question[]> => {
  console.log("📥 getQuestions called with quizId:", quizId);

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId);

    if (error) {
      console.error("❌ Error fetching questions:", error);
      throw error;
    }

    console.log("✅ Questions fetched successfully:", {
      count: data?.length || 0,
      data,
    });

    return data || [];
  } catch (err) {
    console.error("💥 Exception in getQuestions:", err);
    throw err;
  }
};

// ============================================================================
// Legacy / Placeholder Functions
// TODO: Implement or remove these
// ============================================================================

export const getAttemptQuestions = async (attemptId: string) => {
  console.log("getAttemptQuestions called - placeholder for ", attemptId);
  return [];
};

export const submitQuizAttempt = (
  quizId: string,
  results: QuestionResult[],
  score: number,
): Promise<unknown> => {
  // Implementation to submit quiz attempt
  console.log("submitQuizAttempt called - placeholder", {
    quizId,
    results,
    score,
  });
  return Promise.resolve({});
};

export const updateQuizAttempt = (
  attemptId: string,
  updates: Partial<QuizAttempt>,
) => {
  console.log("updateQuizAttempt called - placeholder", { attemptId, updates });
  return Promise.resolve({} as QuizAttempt);
};

// ============================================================================
// Re-export specialized services for convenience
// ============================================================================

export { generateQuiz } from "./quizGenerationService";
export {
  createQuizAttempt,
  getActiveAttempt,
  getAttemptAnswers,
  getAttemptById,
  saveUserAnswer,
} from "./quizAttemptService";
export {
  completeQuizAttempt,
  getMasterySummaryAfterQuiz,
  updateMasteryAfterQuiz,
} from "./quizCompletionService";
