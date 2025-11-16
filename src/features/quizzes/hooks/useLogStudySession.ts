import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudySession } from "@/features/study-plan/services/study-sessions.service";
import { updateLastStudied } from "@/features/subjects/services/subjectService";

interface LogStudySessionParams {
  subjectId: string;
  durationMinutes: number;
  mood?: "confident" | "okay" | "struggling" | "confused";
  topicsCovered?: string[];
  materialsUsed?: string[];
  notes?: string;
}

/**
 * Hook to log study session after quiz completion or other study activities
 * This updates:
 * 1. study_sessions table - for garden health calculation and streak tracking
 * 2. subjects.last_studied_at - for showing last study time on subject cards
 *
 * TODO: Enhance with quiz-specific data (quiz_id, questions_answered, etc.)
 * TODO: Consider adding session_type field to differentiate quiz, review, material_study
 * TODO: Track materials_used array when we have material study tracking
 */
export function useLogStudySession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: LogStudySessionParams) => {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

      // Create study session record
      const sessionResult = await createStudySession({
        subjectId: params.subjectId,
        sessionDate: today,
        durationMinutes: params.durationMinutes,
        topicsCovered: params.topicsCovered,
        materialsUsed: params.materialsUsed,
        mood: params.mood,
        notes: params.notes,
      });

      if (sessionResult.error) {
        throw new Error(sessionResult.error);
      }

      // Update subject's last_studied_at timestamp
      const lastStudiedResult = await updateLastStudied(params.subjectId);

      if (!lastStudiedResult.success) {
        // Log warning but don't fail - session was still created
        console.warn(
          "Failed to update last_studied_at:",
          lastStudiedResult.error
        );
      }

      return sessionResult.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["studySessions", variables.subjectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects", variables.subjectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
      // Invalidate garden health queries since they depend on study sessions
      queryClient.invalidateQueries({
        queryKey: ["gardenHealth"],
      });
      queryClient.invalidateQueries({
        queryKey: ["plantState", variables.subjectId],
      });
    },
    onError: (error) => {
      console.error("Failed to log study session:", error);
      // TODO: Add toast notification for user feedback
      // TODO: Consider retry logic for failed session logging
    },
  });
}
