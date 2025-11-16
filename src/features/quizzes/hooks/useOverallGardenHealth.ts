/**
 * useOverallGardenHealth Hook
 *
 * Calculates and provides overall garden health across all subjects.
 * Used in Dashboard and other overview pages.
 */

import { useState, useEffect } from "react";
import {
  calculateOverallGardenHealth,
  getGardenEmoticon,
  getGardenStatusLabel,
  getGardenMotivationalMessage,
} from "../services/plantStateService";

interface GardenHealthResult {
  health: number | null;
  emoticon: string;
  statusLabel: string;
  motivationalMessage: string;
  isLoading: boolean;
}

export function useOverallGardenHealth(): GardenHealthResult {
  const [health, setHealth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      setIsLoading(true);
      try {
        const overallHealth = await calculateOverallGardenHealth();
        setHealth(overallHealth);
      } catch (error) {
        console.error("Error fetching garden health:", error);
        setHealth(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const emoticon = health !== null ? getGardenEmoticon(health) : "🌱";
  const statusLabel =
    health !== null ? getGardenStatusLabel(health) : "Growing";
  const motivationalMessage =
    health !== null
      ? getGardenMotivationalMessage(health)
      : "Start studying to grow your garden! 🌱";

  return {
    health,
    emoticon,
    statusLabel,
    motivationalMessage,
    isLoading,
  };
}
