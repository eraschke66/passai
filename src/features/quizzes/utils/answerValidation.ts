import type { Question } from "../types/quiz";

/**
 * Validates if a user's answer is correct based on question type
 *
 * For multiple-choice: correct_answer stores the index (0-based) of the correct option
 * For true-false: correct_answer stores "true" or "false"
 * For short-answer: direct string comparison (case-insensitive)
 */
export const isAnswerCorrect = (
  question: Question,
  userAnswer: string
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
        (opt) => opt === userAnswer
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
