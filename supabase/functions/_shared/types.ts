/**
 * Shared TypeScript types for Edge Functions
 */

// ============================================================================
// Generic Response Types
// ============================================================================

export interface EdgeFunctionResponse<T> {
    data?: T;
    error?: string;
}

// ============================================================================
// Quiz Generation Types
// ============================================================================

export interface QuizSettings {
    questionCount: number;
    difficulty: "easy" | "medium" | "hard" | "adaptive";
    questionTypes: {
        multipleChoice: boolean;
        trueFalse: boolean;
        shortAnswer: boolean;
        matching: boolean;
    };
    cognitiveMix: {
        recall: number;
        understanding: number;
        application: number;
    };
    focusAreas?: string;
    customTitle?: string;
    timeLimit?: number;
}

export interface QuizGenerationRequest {
    subjectId: string;
    materialIds: string[];
    settings: QuizSettings;
}

export interface GeneratedQuestion {
    question: string;
    type: "multiple-choice" | "true-false" | "short-answer" | "essay";
    options: string[] | null;
    correct_answer: string;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string;
    concept: string;
    points: number;
    source_snippet: string;
}

export interface QuizGenerationResponse {
    questions: GeneratedQuestion[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// ============================================================================
// AI Grading Types
// ============================================================================

export interface GradingRequest {
    questionType: "short-answer" | "essay";
    question: string;
    modelAnswer: string;
    studentAnswer: string;
    rubric?: string; // For essays
    context?: {
        subject?: string;
        topic?: string;
        difficulty?: string;
    };
}

export interface GradingResponse {
    score: number; // 0-100
    isCorrect: boolean; // true if score >= 70
    feedback: string;
    keyPoints?: {
        captured: string[];
        missed: string[];
    };
    rubricBreakdown?: {
        criterion: string;
        score: number;
        maxScore: number;
        feedback: string;
    }[];
}

// ============================================================================
// Subject/Material Types (from database)
// ============================================================================

export interface Subject {
    id: string;
    user_id: string;
    name: string;
    exam_board?: string | null;
    question_style?: string | null;
    teacher_emphasis?: string | null;
    grading_rubric?: string | null;
}

export interface StudyMaterial {
    id: string;
    subject_id: string;
    user_id: string;
    text_content: string;
    file_name: string;
}
