import type { SUBJECT_ICONS, SUBJECT_COLORS } from "./constants";

// =============================================
// Base Subject Type (matches database schema)
// =============================================

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  test_date: string | null; // ISO date string
  exam_board: string | null;
  teacher_emphasis: string | null;
  question_style: QuestionStyle; // Format of questions to generate
  grading_rubric: string | null; // How the teacher grades
  icon: SubjectIcon;
  color: SubjectColor;
  progress: number; // 0-100
  pass_chance: number | null; // 0-100 or null if insufficient data
  created_at: string;
  updated_at: string;
  last_studied_at: string | null;
}

// =============================================
// Type Utilities
// =============================================

export type SubjectIcon = (typeof SUBJECT_ICONS)[number];
export type SubjectColor = (typeof SUBJECT_COLORS)[number];

// Question styles for quiz generation (Teacher Layer)
export type QuestionStyle =
  | "multiple_choice"
  | "short_answer"
  | "essay"
  | "mixed";

// Exam boards supported for curriculum alignment
export type ExamBoard =
  | "IB"
  | "AP"
  | "A-Level"
  | "GCSE"
  | "IGCSE"
  | "SAT"
  | "Other"
  | null;

// For creating a new subject (user doesn't provide all fields)
export interface CreateSubjectInput {
  name: string;
  description?: string | null;
  test_date?: string | null;
  exam_board?: string | null;
  teacher_emphasis?: string | null;
  question_style?: QuestionStyle;
  grading_rubric?: string | null;
  icon?: SubjectIcon;
  color?: SubjectColor;
}

// For updating a subject (all fields optional except what user wants to change)
export interface UpdateSubjectInput {
  name?: string;
  description?: string | null;
  test_date?: string | null;
  exam_board?: string | null;
  teacher_emphasis?: string | null;
  question_style?: QuestionStyle;
  grading_rubric?: string | null;
  icon?: SubjectIcon;
  color?: SubjectColor;
  progress?: number;
  pass_chance?: number | null;
  last_studied_at?: string | null;
}

// =============================================
// Subject with Computed Properties
// =============================================

export interface SubjectWithStats extends Subject {
  daysUntilTest: number | null; // null if no test date
  isTestSoon: boolean; // true if test is within 7 days
  isTestPast: boolean; // true if test date has passed
  materialsCount: number; // Count of uploaded materials (will be populated in Phase 3)
  quizzesCount: number; // Count of taken quizzes (will be populated in Phase 4)
  progressLevel: "low" | "medium" | "high"; // Based on progress thresholds
  passChanceLevel: "low" | "medium" | "high" | "unknown"; // Based on pass chance
}

// =============================================
// Query Options
// =============================================

export interface SubjectQueryOptions {
  sortBy?: "test_date" | "created_at" | "updated_at" | "name" | "progress";
  sortOrder?: "asc" | "desc";
  filterBy?: {
    hasTestDate?: boolean; // Only subjects with upcoming tests
    isActive?: boolean; // Test date in future or no test date
    isArchived?: boolean; // Test date in past
  };
  search?: string; // Search in name and description
}

// =============================================
// Service Response Types
// =============================================

export interface SubjectServiceResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =============================================
// Calculation Input Types
// =============================================

export interface ProgressCalculationInput {
  materialsCount: number;
  quizzesCount: number;
  averageQuizScore?: number; // 0-100
}

export interface PassChanceCalculationInput {
  quizScores: number[]; // Array of quiz scores (0-100)
  averageScore: number; // 0-100
  daysUntilTest: number | null;
  studyConsistency: number; // 0-1, based on study frequency
}
