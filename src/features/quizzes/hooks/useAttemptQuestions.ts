import { useQuery } from "@tanstack/react-query";
import { getAttemptQuestions } from "../services/quizzesService";
import type { QuizQuestion } from "../types/quiz";

export const useAttemptQuestions = (attemptId: string) => {
  return useQuery<QuizQuestion[]>({
    queryKey: ["attemptQuestions", attemptId],
    queryFn: () => getAttemptQuestions(attemptId),
    enabled: !!attemptId,
  });
};
