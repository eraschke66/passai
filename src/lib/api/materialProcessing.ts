/**
 * Material Processing API Client
 * Handles communication with the PassAI backend for material text extraction
 */

import { supabase } from "@/lib/supabase/client";

// Backend API configuration
const getBackendUrl = (): string => {
  const url = import.meta.env.VITE_BACKEND_URL;

  if (!url) {
    console.warn("VITE_BACKEND_URL not configured, using default");
    return "http://localhost:8000";
  }

  return url;
};

const BACKEND_URL = getBackendUrl();

/**
 * Request payload for material processing
 */
export interface ProcessMaterialRequest {
  material_id: string;
  storage_path: string;
}

/**
 * Success response from backend
 */
export interface ProcessMaterialResponse {
  success: boolean;
  material_id: string;
  text_length: number;
  file_type: string;
  processing_time: number;
  message: string;
}

/**
 * Error response from backend
 */
export interface ProcessMaterialError {
  detail: string;
}

/**
 * Calls the backend API to process a material
 *
 * @param materialId - UUID of the material to process
 * @param storagePath - Path to the file in Supabase Storage
 * @returns Promise with processing result
 * @throws Error if request fails or user not authenticated
 *
 * @example
 * ```typescript
 * try {
 *   const result = await processMaterial(materialId, storagePath);
 *   console.log('Processing complete:', result);
 * } catch (error) {
 *   console.error('Processing failed:', error);
 * }
 * ```
 */
export async function processMaterial(
  materialId: string,
  storagePath: string
): Promise<ProcessMaterialResponse> {
  // Get authenticated user's JWT token
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("User not authenticated. Please log in and try again.");
  }

  // Build request payload
  const payload: ProcessMaterialRequest = {
    material_id: materialId,
    storage_path: storagePath,
  };

  console.log("🚀 Calling backend to process material:", {
    materialId,
    storagePath,
    backend: BACKEND_URL,
  });

  // Call backend API
  const response = await fetch(`${BACKEND_URL}/api/v1/process-material`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Handle error responses
  if (!response.ok) {
    let errorMessage = `Backend error: ${response.status} ${response.statusText}`;

    try {
      const errorData: ProcessMaterialError = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Could not parse error response, use default message
    }

    console.error("❌ Backend processing failed:", errorMessage);
    throw new Error(errorMessage);
  }

  // Parse success response
  const result: ProcessMaterialResponse = await response.json();

  console.log("✅ Backend processing initiated:", {
    materialId: result.material_id,
    textLength: result.text_length,
    fileType: result.file_type,
    processingTime: `${result.processing_time}ms`,
  });

  return result;
}

/**
 * Health check for backend API
 * Useful for verifying backend connectivity
 *
 * @returns Promise with health status
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/health`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Backend health check failed:", error);
    throw error;
  }
}
