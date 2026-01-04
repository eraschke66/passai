/**
 * Backend API Client
 * Handles communication with the PassAI backend for material processing
 */

import { supabase } from "@/lib/supabase/client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Get authentication token for backend requests
 */
async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Process a material that was uploaded to Supabase Storage
 */
export async function processMaterial(
  materialId: string,
  storagePath: string,
  fileType: string
): Promise<ProcessMaterialResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("material_id", materialId);
  formData.append("storage_path", storagePath);
  formData.append("file_type", fileType);

  const response = await fetch(`${BACKEND_URL}/api/v1/process-material`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Processing failed" }));
    throw new Error(error.detail || "Processing failed");
  }

  return response.json();
}

/**
 * Batch process multiple materials
 */
export async function batchProcessMaterials(
  materialIds: string[]
): Promise<BatchProcessResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  materialIds.forEach((id) => formData.append("material_ids", id));

  const response = await fetch(`${BACKEND_URL}/api/v1/batch-process`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Batch processing failed" }));
    throw new Error(error.detail || "Batch processing failed");
  }

  return response.json();
}

/**
 * Get user storage usage
 */
export async function getStorageUsage(): Promise<StorageUsageResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${BACKEND_URL}/api/v1/storage-usage`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Failed to fetch storage usage" }));
    throw new Error(error.detail || "Failed to fetch storage usage");
  }

  return response.json();
}

/**
 * Get material processing status
 */
export async function getMaterialStatus(
  materialId: string
): Promise<MaterialStatusResponse> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/v1/materials/${materialId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Failed to get material status" }));
    throw new Error(error.detail || "Failed to get material status");
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${BACKEND_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error("Backend is not healthy");
  }

  return response.json();
}

// Type definitions
export interface ProcessMaterialResponse {
  success: boolean;
  material_id: string;
  processing_status: "processing_chunks" | "ready" | "failed" | "chunk_failed";
  error_message?: string;
  text_length: number;
  text_preview?: string;
  message?: string;
}

export interface MaterialStatusResponse {
  material_id: string;
  file_name: string;
  processing_status: "processing_chunks" | "ready" | "failed" | "chunk_failed";
  error_message?: string;
  chunk_count: number;
  created_at: string;
  updated_at: string;
  is_ready_for_rag: boolean;
}

export interface BatchProcessResponse {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    material_id: string;
    success: boolean;
    processing_status?: string;
    error?: string;
    text_length?: number;
  }>;
}

export interface StorageUsageResponse {
  used: number;
  limit: number;
  used_mb: number;
  limit_mb: number;
  percentage: number;
  available: number;
}
