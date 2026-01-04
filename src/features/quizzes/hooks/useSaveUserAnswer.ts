import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveUserAnswer } from "../services/quizAttemptService";

interface SaveAnswerParams {
  attemptId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  currentQuestionIndex: number;
}

export const useSaveUserAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SaveAnswerParams) =>
      saveUserAnswer(
        params.attemptId,
        params.questionId,
        params.userAnswer,
        params.isCorrect,
        params.timeSpent,
        params.currentQuestionIndex,
      ),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["active-attempt"] });
    },
    onError: (error) => {
      console.error("Failed to save user answer:", error);
    },
  });
};
