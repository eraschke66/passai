import { useQuery } from "@tanstack/react-query";
import { getActiveAttempt } from "../services/quizAttemptService";

export const useActiveAttempt = (userId: string, quizId: string) => {
  return useQuery({
    queryKey: ["active-attempt", userId, quizId],
    queryFn: () => getActiveAttempt(userId, quizId),
    enabled: !!userId && !!quizId,
    staleTime: 30 * 1000, // 30 seconds
  });
};
