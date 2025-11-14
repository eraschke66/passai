// update quiz attempt hook using react-query. update quiz attempt and user answers

/**
 * React Query hook for updating an existing quiz attempt.
 */

import { useMutation } from "@tanstack/react-query";
import { updateQuizAttempt } from "../services/quizzesService";
import type { QuizAttempt } from "../types/quiz";

export const useUpdateQuizAttempt = (attemptId: string) => {
  return useMutation<QuizAttempt, Error, Partial<QuizAttempt>>({
    mutationFn: (updatedFields: Partial<QuizAttempt>) =>
      updateQuizAttempt(attemptId, updatedFields),
  });
};
