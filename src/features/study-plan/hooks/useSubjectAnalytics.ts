/**
 * useSubjectAnalytics Hook
 *
 * Fetches comprehensive analytics data for a subject:
 * - Pass probability
 * - Weak areas
 * - Progress metrics
 * - Study plan info
 *
 * Uses React Query for caching and automatic refetching
 * All business logic is in service layer
 */

import { useQuery } from "@tanstack/react-query";
import {
  getPredictedPassProbability,
  getWeakTopics,
} from "../services/mastery.service";
import { getStudyPlansBySubject } from "../services/study-plan.service";
import type { WeakArea } from "../types/analytics.types";

// =====================================================
// Types
// =====================================================

export interface SubjectAnalytics {
  passChance: number;
  confidence: "low" | "medium" | "high";
  trend: "improving" | "stable" | "declining";
  weakAreas: WeakArea[];
  progress: {
    materialCoverage: number;
    averageMastery: number;
    totalStudyHours: number;
    completionRate: number;
  };
  activePlan: {
    id: string;
    title: string;
    projectedPassChance: number;
    totalHours: number;
    completionDate: Date;
  } | null;
}

// =====================================================
// Helper Functions
// =====================================================

/**
 * Calculate confidence level based on data availability
 * More topics and higher mastery = higher confidence
 */
function calculateConfidence(
  topicCount: number,
  averageMastery: number
): "low" | "medium" | "high" {
  if (topicCount === 0) return "low";
  if (topicCount >= 5 && averageMastery >= 50) return "high";
  if (topicCount >= 3 || averageMastery >= 30) return "medium";
  return "low";
}

/**
 * Calculate trend based on current pass chance
 * TODO: Enhance with historical data comparison
 */
function calculateTrend(
  passChance: number
): "improving" | "stable" | "declining" {
  // Placeholder implementation - would compare with previous values in real scenario
  if (passChance >= 70) return "stable";
  if (passChance >= 40) return "improving";
  return "declining";
}

// =====================================================
// Hook
// =====================================================

export function useSubjectAnalytics(subjectId: string | undefined) {
  return useQuery({
    queryKey: ["subject-analytics", subjectId],
    queryFn: async (): Promise<SubjectAnalytics> => {
      if (!subjectId) {
        throw new Error("Subject ID is required");
      }

      // Fetch all data in parallel
      const [passProbResult, weakAreasResult, studyPlansResult] =
        await Promise.all([
          getPredictedPassProbability(subjectId),
          getWeakTopics(subjectId, 60, 5),
          getStudyPlansBySubject(subjectId),
        ]);

      // Extract pass probability data
      const passProbData = passProbResult.data;
      const passChance = passProbData?.probability || 0;

      // Extract weak areas
      const weakAreas = weakAreasResult.data || [];

      // Calculate progress metrics (placeholder - will be enhanced)
      const averageMastery =
        weakAreas.length > 0
          ? Math.round(
              weakAreas.reduce((sum, area) => sum + area.masteryLevel, 0) /
                weakAreas.length
            )
          : 0;

      // Find active plan
      const plans = studyPlansResult.data || [];
      const activePlanData = plans.find((p) => p.status === "active");

      const activePlan = activePlanData
        ? {
            id: activePlanData.id,
            title: activePlanData.title,
            projectedPassChance: activePlanData.projected_pass_chance || 0,
            totalHours: activePlanData.total_hours,
            completionDate: new Date(activePlanData.end_date),
          }
        : null;

      // Calculate confidence based on topic count and average mastery
      const confidence = calculateConfidence(
        passProbData?.topicCount || 0,
        passProbData?.averageMastery || 0
      );

      // Calculate trend (placeholder - could be enhanced with historical data)
      const trend = calculateTrend(passChance);

      return {
        passChance,
        confidence,
        trend,
        weakAreas,
        progress: {
          materialCoverage: 0, // TODO: Implement when material service is ready
          averageMastery,
          totalStudyHours: 0, // TODO: Calculate from study_sessions table (sum duration_minutes / 60)
          completionRate: 0, // TODO: Implement with task completion tracking
        },
        activePlan,
      };
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
