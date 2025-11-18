/**
 * Material Service - Database Operations
 * Handles all database CRUD operations for study materials
 */

import { supabase } from "@/lib/supabase/client";
import { ProcessingStatus, MaterialSortOption } from "../types/material.types";
import type {
  StudyMaterial,
  CreateMaterialPayload,
  UpdateMaterialPayload,
  MaterialFilters,
  StorageUsage,
} from "../types/material.types";
import { parseStudyMaterial, parseStudyMaterials } from "./schemas";
import { FREE_TIER_STORAGE_LIMIT } from "../types/constants";
import { sanitizeTextForDatabase } from "../utils/textSanitizer";

// =====================================================
// Create Operations
// =====================================================

/**
 * Creates a new material record in the database
 * @param payload - Material data to insert
 * @returns Created material or null if error
 */
export async function createMaterial(
  payload: CreateMaterialPayload
): Promise<StudyMaterial | null> {
  try {
    // Sanitize text content if provided
    const sanitizedTextContent = payload.text_content
      ? sanitizeTextForDatabase(payload.text_content)
      : null;

    const { data, error } = await supabase
      .from("study_materials")
      .insert({
        subject_id: payload.subject_id,
        user_id: payload.user_id,
        file_name: payload.file_name,
        file_type: payload.file_type,
        file_size: payload.file_size,
        storage_path: payload.storage_path,
        thumbnail_url: payload.thumbnail_url || null,
        text_content: sanitizedTextContent,
        processing_status:
          payload.processing_status || ProcessingStatus.PENDING,
        error_message: payload.error_message || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create material:", error);
      return null;
    }

    return parseStudyMaterial(data);
  } catch (error) {
    console.error("Unexpected error creating material:", error);
    return null;
  }
}

/**
 * Creates multiple material records in a batch
 * @param payloads - Array of material data to insert
 * @returns Array of created materials
 */
export async function createMaterials(
  payloads: CreateMaterialPayload[]
): Promise<StudyMaterial[]> {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .insert(
        payloads.map((payload) => {
          // Sanitize text content if provided
          const sanitizedTextContent = payload.text_content
            ? sanitizeTextForDatabase(payload.text_content)
            : null;

          return {
            subject_id: payload.subject_id,
            user_id: payload.user_id,
            file_name: payload.file_name,
            file_type: payload.file_type,
            file_size: payload.file_size,
            storage_path: payload.storage_path,
            thumbnail_url: payload.thumbnail_url || null,
            text_content: sanitizedTextContent,
            processing_status:
              payload.processing_status || ProcessingStatus.PENDING,
            error_message: payload.error_message || null,
          };
        })
      )
      .select();

    if (error) {
      console.error("Failed to create materials:", error);
      return [];
    }

    return parseStudyMaterials(data);
  } catch (error) {
    console.error("Unexpected error creating materials:", error);
    return [];
  }
}

// =====================================================
// Read Operations
// =====================================================

/**
 * Fetches a single material by ID
 * @param materialId - Material UUID
 * @returns Material or null if not found
 */
export async function getMaterialById(
  materialId: string
): Promise<StudyMaterial | null> {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .select("*")
      .eq("id", materialId)
      .single();

    if (error) {
      console.error("Failed to fetch material:", error);
      return null;
    }

    return parseStudyMaterial(data);
  } catch (error) {
    console.error("Unexpected error fetching material:", error);
    return null;
  }
}

/**
 * Fetches all materials for a user with optional filters
 * @param userId - User UUID
 * @param filters - Optional filters (subject, search, sort, status)
 * @returns Array of materials
 */
export async function getMaterialsByUser(
  userId: string,
  filters?: MaterialFilters
): Promise<StudyMaterial[]> {
  try {
    let query = supabase
      .from("study_materials")
      .select("*")
      .eq("user_id", userId);

    // Filter by subject
    if (filters?.subjectId) {
      query = query.eq("subject_id", filters.subjectId);
    }

    // Filter by processing status
    if (filters?.processingStatus && filters.processingStatus !== "all") {
      query = query.eq("processing_status", filters.processingStatus);
    }

    // Search by file name
    if (filters?.searchQuery) {
      query = query.ilike("file_name", `%${filters.searchQuery}%`);
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case MaterialSortOption.DATE_DESC:
          query = query.order("created_at", { ascending: false });
          break;
        case MaterialSortOption.DATE_ASC:
          query = query.order("created_at", { ascending: true });
          break;
        case MaterialSortOption.NAME_ASC:
          query = query.order("file_name", { ascending: true });
          break;
        case MaterialSortOption.NAME_DESC:
          query = query.order("file_name", { ascending: false });
          break;
        case MaterialSortOption.SIZE_DESC:
          query = query.order("file_size", { ascending: false });
          break;
        case MaterialSortOption.SIZE_ASC:
          query = query.order("file_size", { ascending: true });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }
    } else {
      // Default sort by most recent
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch materials:", error);
      return [];
    }

    return parseStudyMaterials(data);
  } catch (error) {
    console.error("Unexpected error fetching materials:", error);
    return [];
  }
}

/**
 * Fetches all materials for a specific subject
 * @param subjectId - Subject UUID
 * @param limit - Optional limit for number of results
 * @returns Array of materials
 */
export async function getMaterialsBySubject(
  subjectId: string,
  limit?: number
): Promise<StudyMaterial[]> {
  try {
    let query = supabase
      .from("study_materials")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch materials by subject:", error);
      return [];
    }

    return parseStudyMaterials(data);
  } catch (error) {
    console.error("Unexpected error fetching materials by subject:", error);
    return [];
  }
}

/**
 * Counts total materials for a user or subject
 * @param userId - User UUID
 * @param subjectId - Optional subject UUID to filter
 * @returns Total count
 */
export async function countMaterials(
  userId: string,
  subjectId?: string
): Promise<number> {
  try {
    let query = supabase
      .from("study_materials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Failed to count materials:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error counting materials:", error);
    return 0;
  }
}

// =====================================================
// Update Operations
// =====================================================

/**
 * Updates a material record
 * @param materialId - Material UUID
 * @param updates - Fields to update
 * @returns Updated material or null if error
 */
export async function updateMaterial(
  materialId: string,
  updates: UpdateMaterialPayload
): Promise<StudyMaterial | null> {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .update(updates)
      .eq("id", materialId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update material:", error);
      return null;
    }

    return parseStudyMaterial(data);
  } catch (error) {
    console.error("Unexpected error updating material:", error);
    return null;
  }
}

/**
 * Updates the processing status of a material
 * @param materialId - Material UUID
 * @param status - New processing status
 * @param errorMessage - Optional error message if status is failed
 * @returns Success status
 */
export async function updateMaterialStatus(
  materialId: string,
  status: ProcessingStatus,
  errorMessage?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("study_materials")
      .update({
        processing_status: status,
        error_message: errorMessage || null,
      })
      .eq("id", materialId);

    if (error) {
      console.error("Failed to update material status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error updating material status:", error);
    return false;
  }
}

/**
 * Updates the extracted text content of a material
 * @param materialId - Material UUID
 * @param textContent - Extracted text
 * @returns Success status
 */
export async function updateMaterialTextContent(
  materialId: string,
  textContent: string
): Promise<boolean> {
  try {
    // Sanitize text to remove null bytes and problematic characters
    const sanitizedText = sanitizeTextForDatabase(textContent);

    const { error } = await supabase
      .from("study_materials")
      .update({
        text_content: sanitizedText,
        processing_status: ProcessingStatus.READY,
        error_message: null,
      })
      .eq("id", materialId);

    if (error) {
      console.error("Failed to update material text content:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error updating material text content:", error);
    return false;
  }
}

// =====================================================
// Delete Operations
// =====================================================

/**
 * Deletes a material record from the database
 * @param materialId - Material UUID
 * @returns Success status
 */
export async function deleteMaterial(materialId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("study_materials")
      .delete()
      .eq("id", materialId);

    if (error) {
      console.error("Failed to delete material:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting material:", error);
    return false;
  }
}

/**
 * Deletes multiple materials from the database
 * @param materialIds - Array of material UUIDs
 * @returns Success status
 */
export async function deleteMaterials(materialIds: string[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("study_materials")
      .delete()
      .in("id", materialIds);

    if (error) {
      console.error("Failed to delete materials:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting materials:", error);
    return false;
  }
}

/**
 * Deletes all materials for a subject
 * @param subjectId - Subject UUID
 * @returns Success status
 */
export async function deleteMaterialsBySubject(
  subjectId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("study_materials")
      .delete()
      .eq("subject_id", subjectId);

    if (error) {
      console.error("Failed to delete materials by subject:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting materials by subject:", error);
    return false;
  }
}

// =====================================================
// Storage Usage Operations
// =====================================================

/**
 * Calculates total storage usage for a user
 * @param userId - User UUID
 * @returns Storage usage information
 */
export async function getUserStorageUsage(
  userId: string
): Promise<StorageUsage> {
  try {
    // Use the database function we created in migration
    const { data, error } = await supabase.rpc("get_user_storage_usage", {
      user_uuid: userId,
    });

    if (error) {
      console.error("Failed to get storage usage:", error);
      return {
        used: 0,
        limit: FREE_TIER_STORAGE_LIMIT,
        percentage: 0,
      };
    }

    const used = data || 0;
    const limit = FREE_TIER_STORAGE_LIMIT; // TODO: Check user's subscription tier
    const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;

    return {
      used,
      limit,
      percentage,
    };
  } catch (error) {
    console.error("Unexpected error getting storage usage:", error);
    return {
      used: 0,
      limit: FREE_TIER_STORAGE_LIMIT,
      percentage: 0,
    };
  }
}

/**
 * Checks if user has enough storage space for uploads
 * @param userId - User UUID
 * @param uploadSize - Size of files to upload in bytes
 * @returns True if user has enough space, false otherwise
 */
export async function hasStorageSpace(
  userId: string,
  uploadSize: number
): Promise<boolean> {
  try {
    const storageUsage = await getUserStorageUsage(userId);
    return storageUsage.used + uploadSize <= storageUsage.limit;
  } catch (error) {
    console.error("Error checking storage space:", error);
    return false;
  }
}

/**
 * Gets storage usage by file type
 * @param userId - User UUID
 * @returns Object mapping file types to their total size
 */
export async function getStorageUsageByType(userId: string): Promise<{
  pdf: number;
  image: number;
  text: number;
  docx: number;
  pptx: number;
  total: number;
}> {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .select("file_type, file_size")
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to get storage usage by type:", error);
      return {
        pdf: 0,
        image: 0,
        text: 0,
        docx: 0,
        pptx: 0,
        total: 0,
      };
    }

    const usage = {
      pdf: 0,
      image: 0,
      text: 0,
      docx: 0,
      pptx: 0,
      total: 0,
    };

    data.forEach((material) => {
      const type = material.file_type as keyof typeof usage;
      if (type in usage) {
        usage[type] += material.file_size;
      }
      usage.total += material.file_size;
    });

    return usage;
  } catch (error) {
    console.error("Unexpected error getting storage usage by type:", error);
    return {
      pdf: 0,
      image: 0,
      text: 0,
      docx: 0,
      pptx: 0,
      total: 0,
    };
  }
}

// =====================================================
// Statistics Operations
// =====================================================

/**
 * Gets material statistics for a subject
 * @param subjectId - Subject UUID
 * @returns Statistics object
 */
export async function getSubjectMaterialStats(subjectId: string): Promise<{
  totalMaterials: number;
  totalSize: number;
  readyCount: number;
  processingCount: number;
  failedCount: number;
}> {
  try {
    const { data, error } = await supabase
      .from("study_materials")
      .select("file_size, processing_status")
      .eq("subject_id", subjectId);

    if (error) {
      console.error("Failed to get subject material stats:", error);
      return {
        totalMaterials: 0,
        totalSize: 0,
        readyCount: 0,
        processingCount: 0,
        failedCount: 0,
      };
    }

    const stats = {
      totalMaterials: data.length,
      totalSize: 0,
      readyCount: 0,
      processingCount: 0,
      failedCount: 0,
    };

    data.forEach((material) => {
      stats.totalSize += material.file_size;
      if (material.processing_status === ProcessingStatus.READY) {
        stats.readyCount++;
      } else if (material.processing_status === ProcessingStatus.PROCESSING) {
        stats.processingCount++;
      } else if (material.processing_status === ProcessingStatus.FAILED) {
        stats.failedCount++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Unexpected error getting subject material stats:", error);
    return {
      totalMaterials: 0,
      totalSize: 0,
      readyCount: 0,
      processingCount: 0,
      failedCount: 0,
    };
  }
}
