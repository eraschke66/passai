/**
 * useGardenUpdate Hook
 *
 * Handles garden state updates after quiz completion.
 * Keeps QuizResultsPage clean by extracting garden logic.
 */

import { useState, useEffect } from "react";
import {
  updatePlantStateAfterQuiz,
  calculatePointsEarned,
  getGardenEmoticon,
  type PlantState,
} from "../services/plantStateService";

interface UseGardenUpdateProps {
  subjectId: string;
  quizScore: number;
  totalQuestions: number;
  enabled?: boolean; // Only run when quiz is complete
}

interface GardenUpdateResult {
  plantState: PlantState | null;
  pointsEarned: number;
  isLoading: boolean;
  error: string | null;
  gardenEmoticon: string;
}

export function useGardenUpdate({
  subjectId,
  quizScore,
  totalQuestions,
  enabled = true,
}: UseGardenUpdateProps): GardenUpdateResult {
  const [plantState, setPlantState] = useState<PlantState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate points immediately (no async needed)
  const pointsEarned = calculatePointsEarned(quizScore, totalQuestions);

  useEffect(() => {
    if (!enabled || !subjectId) return;

    const updateGarden = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await updatePlantStateAfterQuiz(
          subjectId,
          quizScore,
          totalQuestions
        );

        if (updated) {
          setPlantState(updated);
        } else {
          setError("Failed to update garden");
        }
      } catch (err) {
        console.error("Error updating garden:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    updateGarden();
  }, [subjectId, quizScore, totalQuestions, enabled]);

  const gardenEmoticon = plantState
    ? getGardenEmoticon(plantState.health)
    : "🌱";

  return {
    plantState,
    pointsEarned,
    isLoading,
    error,
    gardenEmoticon,
  };
}
