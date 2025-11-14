import { supabase } from "@/lib/supabase/client";
import type {
  MaterialWithSubject,
  Question,
  QuestionResult,
  QuizAttempt,
  QuizSettings,
  QuizWithSubject,
  Subject,
} from "../types/quiz";
import { generateQuizQuestions } from "../lib/quizGen";

export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) throw error;
  return data || [];
};

// Get all quizzes with their subjects --> TODO: Make sure to filter out per user although RLS may be doing that in the DB
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

export const getQuiz = async (
  quizId: string
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

export const getQuizAttempts = async (
  quizId: string
): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .order("attempt_number", { ascending: false });
  if (error) throw error;
  return data || [];
};

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

// Get the questions for a given quiz
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

  const attemptNumber =
    existingAttempts && existingAttempts.length > 0
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
  return attemptData;
};

// Generate Quiz using OpenAI API and add it to DB
export const generateAndCreateQuiz = async (
  userId: string,
  subjectId: string,
  settings: QuizSettings,
  materialIds: string[]
): Promise<{ quizId: string; questions: Question[] }> => {
  // Fetch materials' text_content
  const { data: materials, error: matError } = await supabase
    .from("study_materials")
    .select("text_content")
    .in("id", materialIds)
    .eq("user_id", userId);
  if (matError) throw matError;

  const combinedText = materials?.map((m) => m.text_content).join("\n\n") || "";
  if (!combinedText) throw new Error("No content available in materials");

  // Generate questions via OpenAI
  const generatedQuestions = await generateQuizQuestions(
    combinedText,
    settings
  );

  // Create quiz
  const newQuiz = {
    user_id: userId,
    subject_id: subjectId,
    title:
      settings.customTitle || `AI Quiz: ${settings.questionCount} Questions`,
    description: `Generated from ${materialIds.length} materials. Focus: ${
      settings.focusAreas || "General"
    }.`,
    questions_count: settings.questionCount,
    duration: settings.timeLimit,
    difficulty: settings.difficulty,
    status: "not-started",
    topics_count: settings.questionCount,
    created_date: new Date().toISOString(),
  };

  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .insert([newQuiz])
    .select("id")
    .single();
  if (quizError) throw quizError;

  // Insert questions
  const questionsWithQuizId = generatedQuestions.map((q) => ({
    quiz_id: quizData.id,
    ...q,
  }));
  console.log("Generated Questions:", questionsWithQuizId);

  const { data: qData, error: qError } = await supabase
    .from("questions")
    .insert(questionsWithQuizId)
    .select("*");
  if (qError) throw qError;

  // Link materials
  const materialLinks = materialIds.map((mid) => ({
    quiz_id: quizData.id,
    material_id: mid,
  }));
  const { error: linkError } = await supabase
    .from("quiz_materials")
    .insert(materialLinks);
  if (linkError) throw linkError;

  return { quizId: quizData.id, questions: qData };
};

// ============================================================================
// Resume Quiz Functionality
// ============================================================================

/**
 * Get a single quiz attempt by ID
 */
export const getAttemptById = async (
  attemptId: string
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
 */
export const getActiveAttempt = async (
  userId: string,
  quizId: string
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
 */
export const getAttemptAnswers = async (
  attemptId: string
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
  const results: QuestionResult[] =
    data?.map((answer) => ({
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
 */
export const saveUserAnswer = async (
  attemptId: string,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  timeSpent: number,
  currentQuestionIndex: number
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
    }
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

/**
 * Complete quiz attempt
 */
export const completeQuizAttempt = async (
  attemptId: string,
  score: number,
  correctAnswers: number,
  totalTimeSpent: number,
  mood?: string | null
): Promise<void> => {
  console.log("🏁 Completing quiz attempt:", { attemptId, score, mood });

  const { error } = await supabase
    .from("quiz_attempts")
    .update({
      status: "completed",
      score,
      correct_answers: correctAnswers,
      time_spent: totalTimeSpent,
      completed_date: new Date().toISOString(),
      mood: mood || null,
    })
    .eq("id", attemptId);

  if (error) {
    console.error("❌ Error completing attempt:", error);
    throw error;
  }

  console.log("✅ Quiz attempt completed");
};
