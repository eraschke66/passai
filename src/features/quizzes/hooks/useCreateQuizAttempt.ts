// create quiz attempt hook using react-query
/**
 * React Query hook for creating a new quiz attempt.
 */
import { useMutation } from "@tanstack/react-query";
import { createQuizAttempt } from "../services/quizAttemptService";
import type { QuizAttempt } from "../types/quiz";

export const useCreateQuizAttempt = (quizId: string, userId: string) => {
  return useMutation<QuizAttempt, Error>({
    mutationFn: () => createQuizAttempt(userId, quizId),
  });
};
