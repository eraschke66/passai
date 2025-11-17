// =============================================
// Subject Icon & Color Presets
// =============================================

export const SUBJECT_ICONS = [
  "book",
  "microscope",
  "flask",
  "calculator",
  "globe",
  "brain",
  "atom",
  "dna",
  "language",
  "palette",
  "music",
  "laptop",
  "scroll",
  "trophy",
  "rocket",
] as const;

export const SUBJECT_COLORS = [
  "blue",
  "green",
  "purple",
  "red",
  "amber",
  "pink",
  "cyan",
  "indigo",
  "emerald",
  "rose",
  "violet",
  "teal",
  "orange",
  "lime",
  "fuchsia",
] as const;

// Preset combinations for quick selection
export const SUBJECT_PRESETS = [
  { icon: "book", color: "blue", name: "General Studies" },
  { icon: "microscope", color: "green", name: "Biology" },
  { icon: "flask", color: "purple", name: "Chemistry" },
  { icon: "calculator", color: "indigo", name: "Mathematics" },
  { icon: "globe", color: "cyan", name: "Geography" },
  { icon: "brain", color: "pink", name: "Psychology" },
  { icon: "atom", color: "violet", name: "Physics" },
  { icon: "dna", color: "emerald", name: "Genetics" },
  { icon: "language", color: "rose", name: "Languages" },
  { icon: "palette", color: "fuchsia", name: "Arts" },
  { icon: "music", color: "amber", name: "Music" },
  { icon: "laptop", color: "teal", name: "Computer Science" },
  { icon: "scroll", color: "orange", name: "History" },
  { icon: "trophy", color: "lime", name: "Physical Education" },
  { icon: "rocket", color: "red", name: "Engineering" },
] as const;

// Get a random preset for new subjects
export function getRandomPreset() {
  return SUBJECT_PRESETS[Math.floor(Math.random() * SUBJECT_PRESETS.length)];
}

// =============================================
// Exam Boards (Common standardized tests)
// =============================================

export const EXAM_BOARDS = [
  "AP (Advanced Placement)",
  "IB (International Baccalaureate)",
  "GCSE",
  "A-Level",
  "SAT Subject Tests",
  "ACT",
  "College Board",
  "State Curriculum",
  "Other",
] as const;

// =============================================
// Question Styles (Teacher Layer)
// =============================================

export const QUESTION_STYLES = [
  {
    value: "multiple_choice",
    label: "Multiple Choice",
    description: "4-option questions (A, B, C, D)",
  },
  {
    value: "short_answer",
    label: "Short Answer",
    description: "Brief written responses (1-3 sentences)",
  },
  {
    value: "essay",
    label: "Essay/Long Answer",
    description: "Extended responses (3-5 paragraphs)",
  },
  {
    value: "mixed",
    label: "Mixed Format",
    description: "Variety of question types",
  },
] as const;

// =============================================
// Constants
// =============================================

export const SUBJECT_LIMITS = {
  FREE_TIER: 3, // TODO: Implement tier checking when subscription system is ready
  PREMIUM_TIER: Infinity,
  NAME_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 1,
  DESCRIPTION_MAX_LENGTH: 500,
  EXAM_BOARD_MAX_LENGTH: 100,
  TEACHER_EMPHASIS_MAX_LENGTH: 500,
  GRADING_RUBRIC_MAX_LENGTH: 1000,
} as const;

export const PROGRESS_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
} as const;

export const PASS_CHANCE_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 75,
  HIGH: 90,
} as const;

// Minimum data requirements for calculations
export const MIN_DATA_REQUIREMENTS = {
  QUIZZES_FOR_PASS_CHANCE: 3, // Need at least 3 quizzes to calculate pass chance
  MATERIALS_FOR_PROGRESS: 1, // Need at least 1 material to start showing progress
} as const;
