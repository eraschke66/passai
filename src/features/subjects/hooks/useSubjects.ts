import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateLastStudied,
} from "../services/subjectService";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../types/subject.types";

// Query keys for cache management
export const subjectKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectKeys.all, "list"] as const,
  details: () => [...subjectKeys.all, "detail"] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};

/**
 * Hook to fetch all subjects
 * Note: Filtering/sorting will be done client-side in Phase 2.5
 */
export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.lists(),
    queryFn: async () => {
      const response = await getSubjects();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single subject by ID
 */
export function useSubject(id: string | undefined) {
  return useQuery({
    queryKey: subjectKeys.detail(id!),
    queryFn: async () => {
      const response = await getSubjectById(id!);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new subject
 */
export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubjectInput) => {
      const response = await createSubject(input);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all subject lists to refetch
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing subject
 */
export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateSubjectInput;
    }) => {
      const response = await updateSubject(id, input);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific subject and all lists
      queryClient.invalidateQueries({
        queryKey: subjectKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

/**
 * Hook to delete a subject
 */
export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteSubject(id);
      if (!response.success) {
        throw new Error(response.error);
      }
    },
    onSuccess: () => {
      // Invalidate all subject queries
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

/**
 * Hook to update last studied timestamp
 */
export function useUpdateLastStudied() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await updateLastStudied(id);
      if (!response.success) {
        throw new Error(response.error);
      }
    },
    onSuccess: (_, id) => {
      // Invalidate the specific subject and all lists
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
