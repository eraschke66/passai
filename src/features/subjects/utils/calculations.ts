import {
  MIN_DATA_REQUIREMENTS,
  PROGRESS_THRESHOLDS,
  PASS_CHANCE_THRESHOLDS,
} from "../types/constants";
import type {
  ProgressCalculationInput,
  PassChanceCalculationInput,
} from "../types";

// =============================================
// Progress Calculation
// =============================================

/**
 * Calculate subject progress based on materials uploaded and quizzes taken
 *
 * Formula:
 * - 30% weight: Materials (max 5 materials = 100% of this component)
 * - 40% weight: Quizzes taken (max 10 quizzes = 100% of this component)
 * - 30% weight: Average quiz performance
 *
 * @param input - Materials count, quizzes count, and average quiz score
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(input: ProgressCalculationInput): number {
  const { materialsCount, quizzesCount, averageQuizScore = 0 } = input;

  // Weights for each component
  const MATERIALS_WEIGHT = 0.3;
  const QUIZZES_WEIGHT = 0.4;
  const PERFORMANCE_WEIGHT = 0.3;

  // Target numbers for 100% in each component
  const TARGET_MATERIALS = 5;
  const TARGET_QUIZZES = 10;

  // Calculate each component (0-100)
  const materialsScore = Math.min(
    (materialsCount / TARGET_MATERIALS) * 100,
    100
  );
  const quizzesScore = Math.min((quizzesCount / TARGET_QUIZZES) * 100, 100);
  const performanceScore = averageQuizScore; // Already 0-100

  // Weighted average
  const progress =
    materialsScore * MATERIALS_WEIGHT +
    quizzesScore * QUIZZES_WEIGHT +
    performanceScore * PERFORMANCE_WEIGHT;

  // Round to nearest integer and clamp between 0-100
  return Math.max(0, Math.min(100, Math.round(progress)));
}

/**
 * Get progress level based on thresholds
 * @param progress - Progress percentage (0-100)
 * @returns Progress level: 'low', 'medium', or 'high'
 */
export function getProgressLevel(progress: number): "low" | "medium" | "high" {
  if (progress < PROGRESS_THRESHOLDS.LOW) return "low";
  if (progress < PROGRESS_THRESHOLDS.MEDIUM) return "medium";
  return "high";
}

// =============================================
// Pass Chance Calculation
// =============================================

/**
 * Calculate predicted pass chance using a simplified Bayesian approach
 *
 * Factors considered:
 * - Average quiz performance (primary factor)
 * - Consistency of scores (less variance = more reliable)
 * - Time until test (more time = more opportunity to improve)
 * - Study consistency (regular studying = higher chance)
 *
 * @param input - Quiz scores, average score, days until test, study consistency
 * @returns Pass chance percentage (0-100) or null if insufficient data
 */
export function calculatePassChance(
  input: PassChanceCalculationInput
): number | null {
  const { quizScores, averageScore, daysUntilTest, studyConsistency } = input;

  // Need minimum number of quizzes to make a prediction
  if (quizScores.length < MIN_DATA_REQUIREMENTS.QUIZZES_FOR_PASS_CHANCE) {
    return null;
  }

  // Base pass chance starts with average score
  let passChance = averageScore;

  // Factor 1: Score variance (consistency)
  // Lower variance = more reliable performance = slight boost
  const variance = calculateVariance(quizScores);
  const stdDev = Math.sqrt(variance);
  const consistencyBonus = Math.max(0, (20 - stdDev) / 20) * 5; // Up to +5%
  passChance += consistencyBonus;

  // Factor 2: Time until test
  // More time = more opportunity to improve (but diminishing returns)
  if (daysUntilTest !== null && daysUntilTest > 0) {
    // Scale: 0-7 days = 0% bonus, 8-14 days = +3%, 15+ days = +5%
    const timeBonus = Math.min(daysUntilTest / 14, 1) * 5;
    passChance += timeBonus;
  } else if (daysUntilTest !== null && daysUntilTest < 0) {
    // Test date passed - no prediction relevant
    return null;
  }

  // Factor 3: Study consistency
  // Regular studying = better retention = slight boost
  const consistencyBonusScore = studyConsistency * 5; // Up to +5%
  passChance += consistencyBonusScore;

  // Factor 4: Trend (are scores improving?)
  const trend = calculateTrend(quizScores);
  const trendBonus = trend * 5; // Up to ±5% based on trend
  passChance += trendBonus;

  // Clamp between 0-100 and round
  return Math.max(0, Math.min(100, Math.round(passChance)));
}

/**
 * Get pass chance level based on thresholds
 * @param passChance - Pass chance percentage (0-100) or null
 * @returns Pass chance level: 'low', 'medium', 'high', or 'unknown'
 */
export function getPassChanceLevel(
  passChance: number | null
): "low" | "medium" | "high" | "unknown" {
  if (passChance === null) return "unknown";
  if (passChance < PASS_CHANCE_THRESHOLDS.LOW) return "low";
  if (passChance < PASS_CHANCE_THRESHOLDS.MEDIUM) return "medium";
  return "high";
}

// =============================================
// Helper Functions
// =============================================

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map((num) => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}

/**
 * Calculate trend (improvement or decline) in scores
 * Uses simple linear regression slope
 * @returns Value between -1 (strong decline) and +1 (strong improvement)
 */
function calculateTrend(scores: number[]): number {
  if (scores.length < 2) return 0;

  const n = scores.length;
  const xValues = Array.from({ length: n }, (_, i) => i); // [0, 1, 2, ...]

  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = scores.reduce((sum, y) => sum + y, 0) / n;

  // Calculate slope
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (scores[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }

  if (denominator === 0) return 0;

  const slope = numerator / denominator;

  // Normalize slope to -1 to +1 range
  // A slope of ±10 points per quiz is considered maximum trend
  return Math.max(-1, Math.min(1, slope / 10));
}

// =============================================
// Date Utilities
// =============================================

/**
 * Calculate days until test date
 * @param testDate - ISO date string
 * @returns Number of days until test (negative if past, null if no date)
 */
export function calculateDaysUntilTest(testDate: string | null): number | null {
  if (!testDate) return null;

  const test = new Date(testDate);
  const today = new Date();

  // Reset time to start of day for accurate day calculation
  test.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = test.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if test is soon (within 7 days)
 */
export function isTestSoon(testDate: string | null): boolean {
  const days = calculateDaysUntilTest(testDate);
  return days !== null && days >= 0 && days <= 7;
}

/**
 * Check if test date has passed
 */
export function isTestPast(testDate: string | null): boolean {
  const days = calculateDaysUntilTest(testDate);
  return days !== null && days < 0;
}

// =============================================
// Study Consistency Calculation
// =============================================

/**
 * Calculate study consistency score based on study activity
 * This is a placeholder for now - will be enhanced when we track study sessions
 *
 * @param lastStudiedDates - Array of ISO date strings when user studied
 * @returns Consistency score (0-1)
 */
export function calculateStudyConsistency(lastStudiedDates: string[]): number {
  if (lastStudiedDates.length === 0) return 0;

  // For now, simple heuristic:
  // - Studied in last 7 days = high consistency
  // - Studied in last 14 days = medium consistency
  // - Older = low consistency

  const mostRecent = new Date(lastStudiedDates[0]);
  const today = new Date();
  const daysSinceLastStudy = Math.floor(
    (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastStudy <= 7) return 1.0;
  if (daysSinceLastStudy <= 14) return 0.6;
  if (daysSinceLastStudy <= 30) return 0.3;
  return 0.1;
}
