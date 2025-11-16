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
import { updateMasteryFromQuizResults } from "@/features/study-plan/services/mastery.service";

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

export const getAttemptQuestions = async (attemptId: string) => {
  console.log("getAttemptQuestions called - placeholder for ", attemptId);
  return [];
};

export const submitQuizAttempt = (
  quizId: string,
  results: QuestionResult[],
  score: number
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
  updates: Partial<QuizAttempt>
) => {
  console.log("updateQuizAttempt called - placeholder", { attemptId, updates });
  return Promise.resolve({} as QuizAttempt);
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
 * Complete quiz attempt and update BKT mastery
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

  // Update BKT mastery after quiz completion
  try {
    await updateMasteryAfterQuiz(attemptId);
    console.log("✅ BKT mastery updated successfully");
  } catch (masteryError) {
    // Log error but don't fail the quiz completion
    console.error("⚠️ Failed to update BKT mastery:", masteryError);
  }
};

// ============================================================================
// BKT Integration Functions
// ============================================================================

/**
 * Update BKT mastery for all topics/concepts covered in a quiz
 * This is called automatically after a quiz is completed
 */
export const updateMasteryAfterQuiz = async (
  attemptId: string
): Promise<void> => {
  console.log("🧠 Updating BKT mastery for attempt:", attemptId);

  // Get the quiz attempt details
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, user_id")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Quiz attempt not found");
  }

  // Get the subject_id from the quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("subject_id")
    .eq("id", attempt.quiz_id)
    .single();

  if (quizError || !quiz) {
    throw new Error("Quiz not found");
  }

  // Get all user answers for this attempt with question details
  const { data: answers, error: answersError } = await supabase
    .from("user_answers")
    .select(
      `
      *,
      questions!question_id (
        topic,
        concept
      )
    `
    )
    .eq("attempt_id", attemptId);

  if (answersError) {
    throw answersError;
  }

  if (!answers || answers.length === 0) {
    console.log("⚠️ No answers found for this attempt");
    return;
  }

  // Group answers by concept (or topic if concept is null)
  const answersByTopic = new Map<string, boolean[]>();

  for (const answer of answers) {
    const question = Array.isArray(answer.questions)
      ? answer.questions[0]
      : answer.questions;

    if (!question) continue;

    // Use concept if available, otherwise fall back to topic
    const topicName = question.concept || question.topic;

    if (!answersByTopic.has(topicName)) {
      answersByTopic.set(topicName, []);
    }

    answersByTopic.get(topicName)!.push(answer.is_correct);
  }

  console.log(`📊 Processing ${answersByTopic.size} topics/concepts`);

  // Update BKT mastery for each topic/concept
  const updatePromises = Array.from(answersByTopic.entries()).map(
    async ([topicName, correctnessArray]) => {
      try {
        console.log(
          `  └─ ${topicName}: ${correctnessArray.filter((c) => c).length}/${
            correctnessArray.length
          } correct`
        );

        const result = await updateMasteryFromQuizResults(
          quiz.subject_id,
          topicName,
          correctnessArray
        );

        if (result.error) {
          console.error(`    ❌ Error updating ${topicName}:`, result.error);
        } else {
          console.log(
            `    ✅ ${topicName} mastery: ${result.data?.mastery_level}%`
          );
        }

        return result;
      } catch (error) {
        console.error(`    ❌ Exception updating ${topicName}:`, error);
        return { data: null, error: String(error) };
      }
    }
  );

  await Promise.all(updatePromises);

  console.log("✅ BKT mastery updates complete");
};

/**
 * Get mastery summary for a subject after quiz
 * Useful for showing improvement/progress after completing a quiz
 */
export const getMasterySummaryAfterQuiz = async (
  attemptId: string
): Promise<{
  topicsUpdated: number;
  averageMastery: number;
  improvedTopics: string[];
  needsWorkTopics: string[];
}> => {
  // Get the quiz attempt
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("quiz_id")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Quiz attempt not found");
  }

  // Get the subject_id
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("subject_id")
    .eq("id", attempt.quiz_id)
    .single();

  if (quizError || !quiz) {
    throw new Error("Quiz not found");
  }

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get all mastery records for this subject
  const { data: masteryRecords, error: masteryError } = await supabase
    .from("topic_mastery")
    .select("topic_name, mastery_level, last_practiced_at")
    .eq("user_id", user.id)
    .eq("subject_id", quiz.subject_id)
    .order("mastery_level", { ascending: true });

  if (masteryError) {
    throw masteryError;
  }

  if (!masteryRecords || masteryRecords.length === 0) {
    return {
      topicsUpdated: 0,
      averageMastery: 0,
      improvedTopics: [],
      needsWorkTopics: [],
    };
  }

  // Calculate average mastery
  const totalMastery = masteryRecords.reduce(
    (sum, record) => sum + record.mastery_level,
    0
  );
  const averageMastery = Math.round(totalMastery / masteryRecords.length);

  // Find recently updated topics (updated in last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const recentlyUpdated = masteryRecords.filter(
    (record) =>
      record.last_practiced_at && record.last_practiced_at >= fiveMinutesAgo
  );

  // Categorize topics
  const improvedTopics = recentlyUpdated
    .filter((record) => record.mastery_level >= 70)
    .map((record) => record.topic_name);

  const needsWorkTopics = masteryRecords
    .filter((record) => record.mastery_level < 60)
    .slice(0, 3) // Top 3 weakest topics
    .map((record) => record.topic_name);

  return {
    topicsUpdated: recentlyUpdated.length,
    averageMastery,
    improvedTopics,
    needsWorkTopics,
  };
};
