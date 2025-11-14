/**
 * Formats time in seconds to a human-readable string
 *
 * @param seconds - Time in seconds
 * @returns Formatted string like "2m 30s" or "45s"
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Formats time in seconds to minutes only (rounded)
 *
 * @param seconds - Time in seconds
 * @returns Formatted string like "2min" or "< 1min"
 */
export const formatTimeInMinutes = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);

  if (minutes === 0) {
    return "< 1min";
  }

  return `${minutes}min`;
};
