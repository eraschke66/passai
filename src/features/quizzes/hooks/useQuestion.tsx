import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../services/quizzesService";
import type { Question } from "../types/quiz";

export const useQuestions = (quizId: string) => {
  return useQuery<Question[]>({
    queryKey: ["questions", quizId],
    queryFn: async () => {
      console.log("🔍 Fetching questions for quizId:", quizId);
      const questions = await getQuestions(quizId);
      console.log("✅ Questions fetched:", questions);
      return questions;
    },
    enabled: !!quizId, // Only run query if quizId exists
    retry: 1,
  });
};
