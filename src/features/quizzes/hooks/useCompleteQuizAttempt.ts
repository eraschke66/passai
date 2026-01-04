import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeQuizAttempt } from "../services/quizCompletionService";

interface CompleteAttemptParams {
  attemptId: string;
  score: number;
  correctAnswers: number;
  totalTimeSpent: number;
  mood?: string | null;
}

export const useCompleteQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CompleteAttemptParams) =>
      completeQuizAttempt(
        params.attemptId,
        params.score,
        params.correctAnswers,
        params.totalTimeSpent,
        params.mood,
      ),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["active-attempt"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
    },
    onError: (error) => {
      console.error("Failed to complete quiz attempt:", error);
    },
  });
};
