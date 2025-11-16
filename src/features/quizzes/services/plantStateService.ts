/**
 * Plant State Service
 *
 * Manages the "Growth Garden" system - PassAI's psychological engagement feature
 * that replaces traditional gamification (badges/streaks) with a nurturing metaphor.
 *
 * Key Concepts:
 * - Points: Earned from correct quiz answers (10 points each)
 * - Level: Increases every 100 points (1, 2, 3, ...)
 * - Health: Based on 7-day study consistency (0-100%)
 * - Emoticons: 🌳 (Thriving) → 🌻 (Blooming) → 🌿 (Healthy) → 🌱 (Growing) → 💧 (Needs Water)
 */

import { supabase } from "@/lib/supabase/client";

// =============================================
// Types
// =============================================

export interface PlantState {
  id: string;
  user_id: string;
  subject_id: string;
  level: number;
  points: number;
  health: number;
  last_tended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GardenStats {
  level: number;
  points: number;
  pointsToNextLevel: number;
  progressToNextLevel: number; // 0-100
  health: number;
  healthStatus: string;
  emoticon: string;
}

// =============================================
// Garden Emoticon System (from founder correspondence)
// =============================================

/**
 * Get garden emoticon based on health percentage
 *
 * Status/Progress Indicators:
 * - 🌳 = Thriving/Excellent (85%+)
 * - 🌻 = Blooming/Very Good (70-85%)
 * - 🌿 = Healthy/Good (55-70%)
 * - 🌱 = Growing/Needs Work (40-55%)
 * - 💧 = Needs Water/Resting (<40%)
 */
export function getGardenEmoticon(health: number): string {
  if (health >= 85) return "🌳"; // Thriving
  if (health >= 70) return "🌻"; // Blooming
  if (health >= 55) return "🌿"; // Healthy
  if (health >= 40) return "🌱"; // Growing
  return "💧"; // Needs water
}

/**
 * Get garden status label based on health percentage
 */
export function getGardenStatusLabel(health: number): string {
  if (health >= 85) return "Thriving";
  if (health >= 70) return "Blooming";
  if (health >= 55) return "Healthy";
  if (health >= 40) return "Growing";
  return "Needs Tending";
}

/**
 * Get motivational message based on health
 */
export function getGardenMotivationalMessage(health: number): string {
  if (health >= 85)
    return "Your garden is flourishing! Keep up the excellent work! 🌳";
  if (health >= 70) return "Beautiful progress! Your garden is blooming! 🌻";
  if (health >= 55)
    return "You're growing steadily! Keep nurturing your garden! 🌿";
  if (health >= 40)
    return "Your garden is taking root! Study more to help it grow! 🌱";
  return "Your garden needs some water! Let's study together today! 💧";
}

// =============================================
// Action/Feedback Emoticons
// =============================================

export const ACTION_EMOTICONS = {
  achievement: "🌻", // Success/Celebration
  tip: "🌺", // Learning Point/Info
  completed: "🎃", // Confirmation/Completed (Harvest)
  focusArea: "🪴", // Focus Area/Needs Attention
  milestone: "💐", // Milestone/Special Achievement
} as const;

// =============================================
// Core CRUD Operations
// =============================================

/**
 * Get plant state for a subject (or create if doesn't exist)
 */
export async function getOrCreatePlantState(
  subjectId: string
): Promise<PlantState | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user");
      return null;
    }

    // Try to get existing plant state
    const { data: existing, error: fetchError } = await supabase
      .from("plant_states")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching plant state:", fetchError);
      return null;
    }

    // Return existing if found
    if (existing) {
      return existing as PlantState;
    }

    // Create new plant state if doesn't exist
    const { data: newPlant, error: createError } = await supabase
      .from("plant_states")
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        level: 1,
        points: 0,
        health: 100,
        last_tended_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating plant state:", createError);
      return null;
    }

    return newPlant as PlantState;
  } catch (error) {
    console.error("Unexpected error in getOrCreatePlantState:", error);
    return null;
  }
}

/**
 * Get plant state (without creating if doesn't exist)
 */
export async function getPlantState(
  subjectId: string
): Promise<PlantState | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("plant_states")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching plant state:", error);
      return null;
    }

    return data as PlantState | null;
  } catch (error) {
    console.error("Unexpected error in getPlantState:", error);
    return null;
  }
}

/**
 * Get all plant states for current user
 */
export async function getAllPlantStates(): Promise<PlantState[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("plant_states")
      .select("*")
      .eq("user_id", user.id)
      .order("health", { ascending: false });

    if (error) {
      console.error("Error fetching all plant states:", error);
      return [];
    }

    return (data as PlantState[]) || [];
  } catch (error) {
    console.error("Unexpected error in getAllPlantStates:", error);
    return [];
  }
}

// =============================================
// Point & Level Calculations
// =============================================

/**
 * Calculate points earned from quiz score
 *
 * @param score - Quiz score (0-100)
 * @param totalQuestions - Total number of questions
 * @returns Points earned (10 points per correct answer)
 */
export function calculatePointsEarned(
  score: number,
  totalQuestions: number
): number {
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  return correctAnswers * 10;
}

/**
 * Calculate level from total points
 * Level increases every 100 points
 *
 * @param points - Total accumulated points
 * @returns Current level (1, 2, 3, ...)
 */
export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

/**
 * Calculate progress to next level (0-100)
 *
 * @param points - Total accumulated points
 * @returns Progress percentage to next level
 */
export function calculateProgressToNextLevel(points: number): number {
  return points % 100;
}

/**
 * Calculate points needed for next level
 *
 * @param points - Total accumulated points
 * @returns Points needed to reach next level
 */
export function calculatePointsToNextLevel(points: number): number {
  return 100 - (points % 100);
}

// =============================================
// Garden Health Calculations
// =============================================

/**
 * Calculate garden health based on study consistency
 *
 * Health = (days studied in last 7 days / 7) * 100
 *
 * @param subjectId - Subject ID
 * @returns Health percentage (0-100)
 */
export async function calculateGardenHealth(
  subjectId: string
): Promise<number> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    // Get study sessions from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]; // YYYY-MM-DD format

    const { data: sessions, error } = await supabase
      .from("study_sessions")
      .select("session_date")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .gte("session_date", sevenDaysAgoStr);

    if (error) {
      console.error("Error fetching study sessions:", error);
      return 0;
    }

    if (!sessions || sessions.length === 0) {
      return 0;
    }

    // Count unique days studied (session_date is already a date string)
    const uniqueDays = new Set(sessions.map((s) => s.session_date));

    // Health = (days studied / 7) * 100
    const health = Math.round((uniqueDays.size / 7) * 100);
    return Math.min(100, Math.max(0, health));
  } catch (error) {
    console.error("Unexpected error in calculateGardenHealth:", error);
    return 0;
  }
}

/**
 * Calculate overall garden health across all subjects
 *
 * @returns Average health percentage (0-100)
 */
export async function calculateOverallGardenHealth(): Promise<number> {
  try {
    const plantStates = await getAllPlantStates();

    if (plantStates.length === 0) {
      return 0;
    }

    const totalHealth = plantStates.reduce(
      (sum, plant) => sum + plant.health,
      0
    );
    const avgHealth = Math.round(totalHealth / plantStates.length);

    return Math.min(100, Math.max(0, avgHealth));
  } catch (error) {
    console.error("Unexpected error in calculateOverallGardenHealth:", error);
    return 0;
  }
}

// =============================================
// Update Operations
// =============================================

/**
 * Update plant state after quiz completion
 *
 * @param subjectId - Subject ID
 * @param quizScore - Quiz score (0-100)
 * @param totalQuestions - Total number of questions
 * @returns Updated plant state with new points/level
 */
export async function updatePlantStateAfterQuiz(
  subjectId: string,
  quizScore: number,
  totalQuestions: number
): Promise<PlantState | null> {
  try {
    // Get or create plant state
    const plantState = await getOrCreatePlantState(subjectId);
    if (!plantState) {
      console.error("Failed to get plant state");
      return null;
    }

    // Calculate points earned and new totals
    const pointsEarned = calculatePointsEarned(quizScore, totalQuestions);
    const newPoints = plantState.points + pointsEarned;
    const newLevel = calculateLevel(newPoints);

    // Update plant state
    const { data, error } = await supabase
      .from("plant_states")
      .update({
        points: newPoints,
        level: newLevel,
        last_tended_at: new Date().toISOString(),
      })
      .eq("id", plantState.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating plant state:", error);
      return null;
    }

    return data as PlantState;
  } catch (error) {
    console.error("Unexpected error in updatePlantStateAfterQuiz:", error);
    return null;
  }
}

/**
 * Update garden health for a subject
 * Should be called after study sessions or periodically
 *
 * @param subjectId - Subject ID
 * @returns Updated plant state with new health
 */
export async function updateGardenHealth(
  subjectId: string
): Promise<PlantState | null> {
  try {
    const health = await calculateGardenHealth(subjectId);
    const plantState = await getOrCreatePlantState(subjectId);

    if (!plantState) {
      console.error("Failed to get plant state");
      return null;
    }

    const { data, error } = await supabase
      .from("plant_states")
      .update({ health })
      .eq("id", plantState.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating garden health:", error);
      return null;
    }

    return data as PlantState;
  } catch (error) {
    console.error("Unexpected error in updateGardenHealth:", error);
    return null;
  }
}

// =============================================
// Helper Functions
// =============================================

/**
 * Get comprehensive garden stats for a subject
 *
 * @param subjectId - Subject ID
 * @returns Garden statistics including level, points, health, emoticon
 */
export async function getGardenStats(
  subjectId: string
): Promise<GardenStats | null> {
  try {
    const plantState = await getOrCreatePlantState(subjectId);
    if (!plantState) return null;

    return {
      level: plantState.level,
      points: plantState.points,
      pointsToNextLevel: calculatePointsToNextLevel(plantState.points),
      progressToNextLevel: calculateProgressToNextLevel(plantState.points),
      health: plantState.health,
      healthStatus: getGardenStatusLabel(plantState.health),
      emoticon: getGardenEmoticon(plantState.health),
    };
  } catch (error) {
    console.error("Unexpected error in getGardenStats:", error);
    return null;
  }
}

/**
 * Check if user leveled up from quiz
 *
 * @param previousPoints - Points before quiz
 * @param newPoints - Points after quiz
 * @returns True if leveled up, false otherwise
 */
export function didLevelUp(previousPoints: number, newPoints: number): boolean {
  const previousLevel = calculateLevel(previousPoints);
  const newLevel = calculateLevel(newPoints);
  return newLevel > previousLevel;
}

/**
 * Get plant stage based on level (for visual representation)
 *
 * @param level - Current level
 * @returns Plant stage description
 */
export function getPlantStage(level: number): {
  stage: string;
  description: string;
} {
  if (level <= 1) {
    return { stage: "Seedling", description: "Just getting started! 🌱" };
  }
  if (level <= 3) {
    return { stage: "Sprout", description: "Growing nicely! 🌿" };
  }
  if (level <= 5) {
    return { stage: "Young Plant", description: "Making great progress! 🪴" };
  }
  if (level <= 10) {
    return {
      stage: "Flowering",
      description: "Your knowledge is blooming! 🌸",
    };
  }
  if (level <= 20) {
    return { stage: "Thriving", description: "Incredible growth! 🌳" };
  }
  return { stage: "Master Gardener", description: "You're a true expert! 🏆" };
}
