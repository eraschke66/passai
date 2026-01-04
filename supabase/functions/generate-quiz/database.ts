/**
 * Database operations for quiz generation
 */

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Database entity types
export interface Subject {
  id: string;
  name: string;
  exam_board: string | null;
  question_style: string | null;
  teacher_emphasis: string | null;
  grading_rubric: string | null;
  user_id: string;
}

export interface StudyMaterial {
  id: string;
  text_content: string;
  user_id: string;
}

export interface GeneratedQuestion {
  question: string;
  type:
    | "multiple-choice"
    | "true-false"
    | "short-answer"
    | "essay"
    | "fill-in-blank";
  options: string[] | null;
  correct_answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  concept: string;
  bloom_level?:
    | "remember"
    | "understand"
    | "apply"
    | "analyze"
    | "evaluate"
    | "create";
  hint?: string;
  points: number;
  source_snippet: string;
}

// Settings type (used in multiple places)
export interface QuizSettings {
  customTitle?: string;
  questionCount: number;
  subjectName: string;
  difficulty: "easy" | "medium" | "hard" | "adaptive";
  timeLimit: number;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    essay: boolean;
    fillInBlank: boolean;
  };
  cognitiveMix: {
    recall: number;
    understanding: number;
    application: number;
  };
  focusAreas?: string;
}

export async function fetchSubject(
  supabaseClient: SupabaseClient,
  subjectId: string,
  userId: string,
): Promise<Subject> {
  const { data: subject, error } = await supabaseClient
    .from("subjects")
    .select("*")
    .eq("id", subjectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("❌ Subject fetch error:", error);
    throw new Error("Failed to fetch subject");
  }

  if (!subject) {
    throw new Error("Subject not found or access denied");
  }

  console.log("✅ Subject fetched:", subject.name);
  return subject;
}

export async function fetchMaterials(
  supabaseClient: SupabaseClient,
  materialIds: string[],
  userId: string,
): Promise<StudyMaterial[]> {
  const { data: materials, error } = await supabaseClient
    .from("study_materials")
    .select("text_content")
    .in("id", materialIds)
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Materials fetch error:", error);
    throw new Error("Failed to fetch materials");
  }

  if (!materials || materials.length === 0) {
    throw new Error("No materials found");
  }

  console.log("✅ Materials fetched:", materials.length);
  return materials;
}

export function prepareMaterialContent(
  materials: StudyMaterial[],
): string {
  const combinedText = materials.map((m) => m.text_content).join("\n\n");
  console.log("📝 Content length:", combinedText.length);
  return combinedText;
}

interface QuizCreationResult {
  quizId: string;
  title: string;
}

export async function createQuiz(
  supabaseClient: SupabaseClient,
  userId: string,
  subjectId: string,
  subjectName: string,
  settings: QuizSettings,
  materialCount: number,
  questionCount: number,
): Promise<QuizCreationResult> {
  console.log("💾 Creating quiz in database...");

  const quizTitle = settings.customTitle ||
    `${subjectName}: ${settings.questionCount} Questions`;

  const { data: quizData, error } = await supabaseClient
    .from("quizzes")
    .insert([
      {
        user_id: userId,
        subject_id: subjectId,
        title: quizTitle,
        description: `Generated from ${materialCount} materials. Focus: ${
          settings.focusAreas || "General"
        }.`,
        questions_count: questionCount,
        duration: settings.timeLimit,
        difficulty: settings.difficulty,
        status: "not-started",
        topics_count: questionCount,
        created_date: new Date().toISOString(),
      },
    ])
    .select("id, title")
    .single();

  if (error || !quizData) {
    console.error("❌ Quiz creation error:", error);
    throw new Error("Failed to create quiz in database");
  }

  console.log("✅ Quiz created:", quizData.id);
  return { quizId: quizData.id, title: quizData.title };
}

export async function insertQuestions(
  supabaseClient: SupabaseClient,
  quizId: string,
  questions: GeneratedQuestion[],
): Promise<void> {
  const questionsWithQuizId = questions.map((q) => ({
    quiz_id: quizId,
    question: q.question,
    type: q.type,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    bloom_level: q.bloom_level,
    hint: q.hint,
    topic: q.topic,
    concept: q.concept,
    points: q.points,
    source_snippet: q.source_snippet,
  }));

  const { error } = await supabaseClient
    .from("questions")
    .insert(questionsWithQuizId);

  if (error) {
    console.error("❌ Questions insertion error:", error);
    // Attempt to clean up the quiz
    await supabaseClient.from("quizzes").delete().eq("id", quizId);
    throw new Error("Failed to save questions to database");
  }

  console.log("✅ Questions inserted:", questions.length);
}

export async function linkMaterialsToQuiz(
  supabaseClient: SupabaseClient,
  quizId: string,
  materialIds: string[],
): Promise<void> {
  const materialLinks = materialIds.map((materialId) => ({
    quiz_id: quizId,
    material_id: materialId,
  }));

  const { error } = await supabaseClient
    .from("quiz_materials")
    .insert(materialLinks);

  if (error) {
    console.error("❌ Material linking error:", error);
    // Log but don't fail - quiz and questions are already created
    console.warn("⚠️ Material links failed but quiz was created");
  } else {
    console.log("✅ Materials linked:", materialIds.length);
  }
}
