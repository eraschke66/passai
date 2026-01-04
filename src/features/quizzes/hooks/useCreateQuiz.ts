import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateQuiz } from "../services/quizGenerationService";
import type { QuizSettings } from "../types/quiz";

/**
 * Hook for creating a new quiz via AI generation
 *
 * The Edge Function authenticates the user automatically via the auth token,
 * so no userId parameter is needed.
 *
 * @returns Mutation hook with quiz generation function
 */
export const useCreateQuiz = () => {
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
    }) => generateQuiz(subjectId, materialIds, settings),
    onSuccess: () => {
      // Invalidate quiz list to show the new quiz
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      // Invalidate questions cache in case it's being used elsewhere
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};
