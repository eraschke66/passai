import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../services/quizzesService";
import type { MaterialWithSubject } from "../types/quiz";

export const useMaterials = () => {
  return useQuery<MaterialWithSubject[]>({
    queryKey: ["materials"],
    queryFn: getMaterials,
  });
};
