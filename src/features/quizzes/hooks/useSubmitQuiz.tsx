import { useMutation } from "@tanstack/react-query";
import { submitQuizAttempt } from "../services/quizzesService";
import type { QuestionResult } from "../types/quiz";

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: ({
      quizId,
      results,
      score,
    }: {
      quizId: string;
      results: QuestionResult[];
      score: number;
    }) => submitQuizAttempt(quizId, results, score),
  });
};
