import type { Question } from "../types/quiz";
import type { GradingResult } from "../services/aiGradingService"; // Type-only import
import { supabase } from "@/lib/supabase/client";

export interface ValidationResult {
  isCorrect: boolean;
  needsAIGrading: boolean;
  gradingResult?: GradingResult;
}

/**
 * Validates if a user's answer is correct based on question type
 *
 * For multiple-choice & true-false: Instant validation
 * For short-answer & essay: Returns flag to trigger AI grading
 */
export const isAnswerCorrect = (
  question: Question,
  userAnswer: string,
): boolean => {
  if (!userAnswer || !question.correct_answer) return false;

  const questionType = question.type;
  const correctAnswer = question.correct_answer;

  switch (questionType) {
    case "multiple-choice": {
      // correct_answer is the index of the correct option
      const correctIndex = parseInt(correctAnswer, 10);
      if (isNaN(correctIndex) || !question.options) return false;

      // Find the index of the user's selected option
      const userAnswerIndex = question.options.findIndex(
        (opt) => opt === userAnswer,
      );

      return userAnswerIndex === correctIndex;
    }

    case "true-false": {
      // Both should be "true" or "false" strings
      return (
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      );
    }

    case "short-answer": {
      // Direct string comparison (case-insensitive, trimmed)
      return (
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      );
    }

    default:
      // For other types, fall back to direct comparison
      return (
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      );
  }
};

/**
 * Gets the correct answer text for display purposes
 *
 * For multiple-choice: returns the option text at the correct index
 * For other types: returns the correct_answer directly
 */
export const getCorrectAnswerText = (question: Question): string => {
  const questionType = question.type;
  const correctAnswer = question.correct_answer;

  if (questionType === "multiple-choice" && question.options) {
    const correctIndex = parseInt(correctAnswer, 10);
    if (
      !isNaN(correctIndex) &&
      correctIndex >= 0 &&
      correctIndex < question.options.length
    ) {
      return question.options[correctIndex];
    }
  }

  return correctAnswer;
};

/**
 * Enhanced validation that supports AI grading for open-ended questions
 * Returns validation result with grading status
 */
export const validateAnswer = async (
  question: Question,
  userAnswer: string,
  rubric?: string,
): Promise<ValidationResult> => {
  if (!userAnswer || !question.correct_answer) {
    return {
      isCorrect: false,
      needsAIGrading: false,
    };
  }

  const questionType = question.type;

  // Instant validation for MC and TF
  if (questionType === "multiple-choice" || questionType === "true-false") {
    return {
      isCorrect: isAnswerCorrect(question, userAnswer),
      needsAIGrading: false,
    };
  }

  // AI grading for short answer and essay
  if (questionType === "short-answer" || questionType === "essay") {
    try {
      console.log("🎓 Calling grade-response Edge Function...");

      const { data: gradingResult, error: gradingError } = await supabase
        .functions.invoke(
          "grade-response",
          {
            body: {
              questionId: question.id,
              questionType: questionType === "essay" ? "essay" : "short-answer",
              question: question.question,
              modelAnswer: question.correct_answer,
              studentAnswer: userAnswer,
              rubric: rubric,
              context: {
                topic: question.topic || undefined,
                difficulty: question.difficulty || undefined,
              },
            },
          },
        );

      if (gradingError) {
        console.error("❌ Grading Edge Function error:", gradingError);
        throw new Error(`Failed to grade answer: ${gradingError.message}`);
      }

      if (!gradingResult || typeof gradingResult.score !== "number") {
        console.error("❌ Invalid grading response:", gradingResult);
        throw new Error("Invalid response from grading service");
      }

      console.log(`✅ Grading complete: ${gradingResult.score}/100`);

      return {
        isCorrect: gradingResult.isCorrect,
        needsAIGrading: false, // Already graded
        gradingResult,
      };
    } catch (error) {
      console.error("AI grading failed:", error);
      // Fallback: return pending state
      return {
        isCorrect: false,
        needsAIGrading: true, // Needs retry
      };
    }
  }

  // Default fallback
  return {
    isCorrect: isAnswerCorrect(question, userAnswer),
    needsAIGrading: false,
  };
};

/**
 * Check if a question type requires AI grading
 */
export const requiresAIGrading = (questionType: string): boolean => {
  return questionType === "short-answer" || questionType === "essay";
};
