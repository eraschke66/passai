import { useQuery } from "@tanstack/react-query";
import { getQuizzes } from "../services/quizzesService";
import type { QuizWithSubject } from "../types/quiz";

export const useQuizzes = () => {
  return useQuery<QuizWithSubject[]>({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });
};
