import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  convertEdgePlanToDatabaseFormat,
  generateStudyPlanEdge,
} from "../services/studyPlanEdgeService";
import { saveStudyPlanToDatabase } from "../services/studyPlanService";
import { toast } from "sonner";

interface GenerateStudyPlanSettings {
  subjectId: string;
  subjectName: string;
  testDate: string | null;
  availableHoursPerWeek: number;
  currentPassChance: number | null;
  quizAttemptId: string;
}

/**
 * Hook to generate and save a study plan using Edge Function with garden metaphor
 * Handles the complete flow: Edge Function AI generation -> Convert to DB format -> Save to DB -> Invalidate cache
 */
export const useGenerateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: GenerateStudyPlanSettings) => {
      // Step 1: Generate study plan using Edge Function
      toast.info("Analyzing your quiz performance... 🌱", {
        duration: 3000,
      });

      const edgeResponse = await generateStudyPlanEdge({
        subjectId: settings.subjectId,
        quizAttemptId: settings.quizAttemptId,
        testDate: settings.testDate || undefined,
        availableHoursPerWeek: settings.availableHoursPerWeek,
      });

      // Step 2: Convert to database format
      const generatedPlan = convertEdgePlanToDatabaseFormat(
        edgeResponse,
        settings.subjectName,
      );

      // Step 3: Save to database
      toast.info("Growing your personalized garden... 🌿", {
        duration: 3000,
      });

      const studyPlanId = await saveStudyPlanToDatabase(
        generatedPlan,
        settings.subjectId,
        settings.testDate,
      );

      return {
        generatedPlan,
        studyPlanId,
        gardenHealth: edgeResponse.metadata.gardenHealth,
        encouragement: edgeResponse.studyPlan.encouragement,
      };
    },
    onSuccess: (result, variables) => {
      // Invalidate study plans query to refetch
      queryClient.invalidateQueries({
        queryKey: ["studyPlans", variables.subjectId],
      });

      toast.success("Your garden is ready! 🌻", {
        description: result.encouragement ||
          "Your personalized study plan is ready to view.",
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      console.error("Error generating study plan:", error);
      toast.error("Failed to generate study plan", {
        description: error.message || "Please try again later.",
        duration: 5000,
      });
    },
  });
};
