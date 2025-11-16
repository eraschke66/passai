import { useState, useEffect } from "react";
import {
  getPlantState,
  getGardenEmoticon,
  getGardenStatusLabel,
} from "../services/plantStateService";

interface SubjectGardenHealthResult {
  health: number | null;
  level: number;
  points: number;
  pointsToNextLevel: number;
  emoticon: string;
  statusLabel: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch garden health for a specific subject
 * @param subjectId - The ID of the subject to fetch garden health for
 * @returns Garden health data including level, points, health, emoticon, and status
 */
export function useSubjectGardenHealth(
  subjectId: string | undefined
): SubjectGardenHealthResult {
  const [health, setHealth] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!subjectId) {
      setIsLoading(false);
      return;
    }

    const fetchSubjectGardenHealth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const plantState = await getPlantState(subjectId);

        if (plantState) {
          setHealth(plantState.health);
          setLevel(plantState.level);
          setPoints(plantState.points);
        } else {
          // No plant state yet - default values
          setHealth(0);
          setLevel(1);
          setPoints(0);
        }
      } catch (err) {
        console.error("Error fetching subject garden health:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch garden health")
        );
        // Set defaults on error
        setHealth(0);
        setLevel(1);
        setPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectGardenHealth();
  }, [subjectId]);

  // Calculate points needed to reach next level (100 points per level)
  const pointsToNextLevel = 100 - (points % 100);

  // Get emoticon and status based on health
  const emoticon = getGardenEmoticon(health ?? 0);
  const statusLabel = getGardenStatusLabel(health ?? 0);

  return {
    health,
    level,
    points,
    pointsToNextLevel,
    emoticon,
    statusLabel,
    isLoading,
    error,
  };
}
