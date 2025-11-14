import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../services/quizzesService";
import type { Subject } from "../types/quiz";

export const useSubjects = () => {
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
};
