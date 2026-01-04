/**
 * Type definitions for quiz grading
 * These match the response from grade-response Edge Function
 */

export interface GradingResult {
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
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
}
