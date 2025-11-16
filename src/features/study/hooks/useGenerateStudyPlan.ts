import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateStudyPlan } from "../lib/studyPlanGen";
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
 * Hook to generate and save a study plan
 * Handles the complete flow: AI generation -> Save to DB -> Invalidate cache
 */
export const useGenerateStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: GenerateStudyPlanSettings) => {
      // Step 1: Generate study plan using AI
      toast.info("Analyzing your quiz performance...", {
        duration: 3000,
      });

      const generatedPlan = await generateStudyPlan(settings);

      // Step 2: Save to database
      toast.info("Creating your personalized study plan...", {
        duration: 3000,
      });

      const studyPlanId = await saveStudyPlanToDatabase(
        generatedPlan,
        settings.subjectId,
        settings.testDate
      );

      return { generatedPlan, studyPlanId };
    },
    onSuccess: (_, variables) => {
      // Invalidate study plans query to refetch
      queryClient.invalidateQueries({
        queryKey: ["studyPlans", variables.subjectId],
      });

      toast.success("Study plan generated successfully! 🪴", {
        description: "Your personalized study plan is ready to view.",
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
