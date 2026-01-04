import type { Database } from "@/lib/supabase/types";

export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];

export type QuizWithSubject = Quiz & {
  subject: string;
  subject_color: string;
};

export type Subject = {
  id: string;
  name: string;
  color: string;
};

export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];

export type QuizMaterial = {
  id: string;
  name: string;
  type: "pdf" | "video" | "notes" | "textbook";
  uploadedDate: string;
};

export type Material = Database["public"]["Tables"]["study_materials"]["Row"];
export type MaterialWithSubject = Material & {
  subject: string;
};
// export type Material = {
//   id: string;
//   name: string;
//   type: "pdf" | "video" | "notes" | "textbook" | "slides";
//   subject: string;
//   uploadedDate: string;
//   pageCount?: number;
//   duration?: string;
// };

export type QuizQuestion = {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
};

export type CognitiveMix = {
  recall: number;
  understanding: number;
  application: number;
};

export type QuizSettings = {
  subjectName: string;
  customTitle: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "adaptive";
  timeLimit: number;
  questionTypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
    essay: boolean;
    fillInBlank: boolean;
  };
  cognitiveMix: CognitiveMix;
  focusAreas: string;
};

export type GenerationStep =
  | "analyzing-materials"
  | "identifying-topics"
  | "generating-questions"
  | "creating-explanations"
  | "finalizing"
  | "complete";

// Previous types...
export type Question = Database["public"]["Tables"]["questions"]["Row"];

// Extended Question type with additional fields
export type QuestionWithHint = Question & {
  bloom_level?:
    | "remember"
    | "understand"
    | "apply"
    | "analyze"
    | "evaluate"
    | "create";
  hint?: string;
};

// export type Question = {
//   id: string;
//   question: string;
//   type: "multiple-choice" | "true-false" | "short-answer" | "essay" | "fill-in-blank";
//   options?: string[];
//   correctAnswer: string;
//   explanation: string;
//   topic: string;
//   difficulty: "easy" | "medium" | "hard";
//   bloom_level?: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
//   hint?: string;
//   sourceSnippet: {
//     material: string;
//     page: number;
//     excerpt: string;
//   };
// };

export type QuestionResult = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  wasAnswered: boolean;
  feedback?: "thumbs-up" | "thumbs-down";
};

// Previous types...

export type Mood = "confident" | "okay" | "struggling" | "confused";

export type MoodOption = {
  id: Mood;
  emoji: string;
  label: string;
  color: string;
  icon: React.ElementType;
};
