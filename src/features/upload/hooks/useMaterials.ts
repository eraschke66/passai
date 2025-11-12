/**
 * Materials Query Hook
 * Fetches, filters, and caches materials using React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getMaterialsByUser,
  getMaterialsBySubject,
  deleteMaterial,
  getUserStorageUsage,
  getSubjectMaterialStats,
} from "../services/materialService";
import { deleteFile } from "../services/storageService";
import { filterAndSortMaterials } from "../utils";
import type {
  StudyMaterial,
  MaterialType,
  MaterialSortOption,
  ProcessingStatus,
} from "../types/material.types";

/**
 * Query key factory for materials
 */
export const materialsKeys = {
  all: ["materials"] as const,
  lists: () => [...materialsKeys.all, "list"] as const,
  list: (userId: string, subjectId?: string) =>
    [...materialsKeys.lists(), { userId, subjectId }] as const,
  detail: (id: string) => [...materialsKeys.all, "detail", id] as const,
  storage: (userId: string) =>
    [...materialsKeys.all, "storage", userId] as const,
  stats: (userId: string, subjectId: string) =>
    [...materialsKeys.all, "stats", userId, subjectId] as const,
};

export interface UseMaterialsOptions {
  subjectId?: string;
  enabled?: boolean;
}

export interface MaterialFilters {
  searchQuery?: string;
  materialTypes?: MaterialType[];
  processingStatuses?: ProcessingStatus[];
  sortBy?: MaterialSortOption;
}

/**
 * Hook for fetching and filtering materials
 */
export function useMaterials(options: UseMaterialsOptions = {}) {
  const { user } = useAuth();

  const {
    data: materials = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: materialsKeys.list(user?.id || "", options.subjectId),
    queryFn: async () => {
      if (!user?.id) return [];

      if (options.subjectId) {
        return getMaterialsBySubject(options.subjectId);
      }

      return getMaterialsByUser(user.id);
    },
    enabled: !!user?.id && (options.enabled ?? true),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  /**
   * Filters and sorts materials based on criteria
   */
  const getFilteredMaterials = (
    filters: MaterialFilters = {}
  ): StudyMaterial[] => {
    return filterAndSortMaterials(materials, filters);
  };

  return {
    materials,
    getFilteredMaterials,
    isLoading,
    isError,
    error,
    refetch,
    isEmpty: materials.length === 0,
  };
}

/**
 * Hook for deleting a material
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      materialId,
      storagePath,
    }: {
      materialId: string;
      storagePath: string;
    }) => {
      // Delete from storage first
      await deleteFile(storagePath);

      // Then delete from database
      const success = await deleteMaterial(materialId);
      if (!success) {
        throw new Error("Failed to delete material from database");
      }

      return { materialId };
    },
    onSuccess: () => {
      // Invalidate all material queries
      queryClient.invalidateQueries({ queryKey: materialsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialsKeys.all });
    },
  });
}

/**
 * Hook for fetching user storage usage
 */
export function useStorageUsage() {
  const { user } = useAuth();

  return useQuery({
    queryKey: materialsKeys.storage(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) {
        return { used: 0, limit: 0, percentage: 0 };
      }

      return getUserStorageUsage(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook for fetching subject material statistics
 */
export function useSubjectMaterialStats(subjectId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: materialsKeys.stats(user?.id || "", subjectId),
    queryFn: async () => {
      if (!user?.id) {
        return { totalCount: 0, totalSize: 0, byType: {} };
      }

      return getSubjectMaterialStats(subjectId);
    },
    enabled: !!user?.id && !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
