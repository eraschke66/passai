/**
 * Material Realtime Hook
 * Subscribes to material processing status changes via Supabase Realtime
 */

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { StudyMaterial } from "../types/material.types";

export interface MaterialStatusUpdate {
  materialId: string;
  status: string;
  textContent: string | null;
  errorMessage: string | null;
  updatedAt: string;
}

export function useMaterialRealtime(
  onStatusChange?: (update: MaterialStatusUpdate) => void
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    console.log("📡 Setting up Realtime subscription for materials");

    // Create Realtime channel for study_materials table
    const channel: RealtimeChannel = supabase
      .channel(`materials:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "study_materials",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("📨 Material status changed:", payload);

          const material = payload.new as StudyMaterial;

          // Notify callback of status change
          if (onStatusChange) {
            onStatusChange({
              materialId: material.id,
              status: material.processing_status,
              textContent: material.text_content,
              errorMessage: material.error_message,
              updatedAt: material.updated_at,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime subscription status:", status);
      });

    // Cleanup on unmount
    return () => {
      console.log("📡 Cleaning up Realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id, onStatusChange]);
}

/**
 * Subscribe to a specific material's status changes
 */
export function useSingleMaterialRealtime(
  materialId: string | null,
  onStatusChange?: (update: MaterialStatusUpdate) => void
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || !materialId) return;

    console.log(`📡 Subscribing to material: ${materialId}`);

    // Create Realtime channel for specific material
    const channel: RealtimeChannel = supabase
      .channel(`material:${materialId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "study_materials",
          filter: `id=eq.${materialId}`,
        },
        (payload) => {
          console.log(`📨 Material ${materialId} updated:`, payload);

          const material = payload.new as StudyMaterial;

          // Notify callback
          if (onStatusChange) {
            onStatusChange({
              materialId: material.id,
              status: material.processing_status,
              textContent: material.text_content,
              errorMessage: material.error_message,
              updatedAt: material.updated_at,
            });
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log(`📡 Unsubscribing from material: ${materialId}`);
      supabase.removeChannel(channel);
    };
  }, [user?.id, materialId, onStatusChange]);
}
