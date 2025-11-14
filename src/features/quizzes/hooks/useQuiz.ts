import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "../services/quizzesService";
import type { QuizWithSubject } from "../types/quiz";

export const useQuiz = (quizId: string) => {
  return useQuery<QuizWithSubject | null>({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuiz(quizId),
  });
};
