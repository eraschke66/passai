import { useQuery } from "@tanstack/react-query";
import { getQuizAttempts } from "../services/quizzesService";
import type { QuizAttempt } from "../types/quiz";

export const useQuizAttempts = (quizId: string) => {
  return useQuery<QuizAttempt[]>({
    queryKey: ["quizAttempts", quizId],
    queryFn: () => getQuizAttempts(quizId),
  });
};
