import { useQuery } from "@tanstack/react-query";
import { getMaterials, getQuizMaterials } from "../services/quizzesService";
import type { MaterialWithSubject } from "../types/quiz";

export const useMaterials = () => {
  return useQuery<MaterialWithSubject[]>({
    queryKey: ["materials"],
    queryFn: getMaterials,
  });
};

/**
 * Hook to fetch materials linked to a specific quiz
 * @param quizId - The quiz ID to fetch materials for
 */
export const useQuizMaterials = (quizId: string) => {
  return useQuery<MaterialWithSubject[]>({
    queryKey: ["quizMaterials", quizId],
    queryFn: () => getQuizMaterials(quizId),
    enabled: !!quizId, // Only run query if quizId is provided
  });
};
