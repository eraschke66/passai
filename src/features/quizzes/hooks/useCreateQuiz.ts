import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAndCreateQuiz } from "../services/quizzesService";
import type { QuizSettings } from "../types/quiz";

export const useCreateQuiz = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subjectId,
      settings,
      materialIds,
    }: {
      subjectId: string;
      settings: QuizSettings;
      materialIds: string[];
    }) => generateAndCreateQuiz(userId, subjectId, settings, materialIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};
