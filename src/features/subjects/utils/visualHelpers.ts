/**
 * Tailwind animation classes for smooth transitions
 * These classes provide consistent animations across the app
 */

export const transitions = {
  // Base transitions
  fast: "transition-all duration-150 ease-in-out",
  normal: "transition-all duration-300 ease-in-out",
  slow: "transition-all duration-500 ease-in-out",

  // Specific property transitions
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-300 ease-in-out",
  opacity: "transition-opacity duration-200 ease-in-out",
  shadow: "transition-shadow duration-200 ease-in-out",

  // Combined transitions
  card: "transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5",
  button: "transition-all duration-150 ease-in-out active:scale-95",
  input: "transition-all duration-200 ease-in-out focus:ring-2",
} as const;

export const animations = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-300",
  fadeOut: "animate-out fade-out duration-200",

  // Slide animations
  slideInFromTop: "animate-in slide-in-from-top duration-300",
  slideInFromBottom: "animate-in slide-in-from-bottom duration-300",
  slideInFromLeft: "animate-in slide-in-from-left duration-300",
  slideInFromRight: "animate-in slide-in-from-right duration-300",

  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-150",

  // Loading animations
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
} as const;

/**
 * Get urgency color classes based on days until test
 */
export function getUrgencyColor(daysUntil: number | null): {
  text: string;
  bg: string;
  border: string;
  badge: string;
} {
  if (daysUntil === null) {
    return {
      text: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-700",
    };
  }

  if (daysUntil < 0) {
    // Past
    return {
      text: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-600",
    };
  }

  if (daysUntil <= 7) {
    // Critical - less than a week
    return {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
    };
  }

  if (daysUntil <= 14) {
    // Warning - less than 2 weeks
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    };
  }

  // Normal - more than 2 weeks
  return {
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  };
}

/**
 * Get progress level color classes
 */
export function getProgressColor(progress: number): {
  bar: string;
  text: string;
  badge: string;
} {
  if (progress >= 80) {
    return {
      bar: "bg-green-600",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    };
  }

  if (progress >= 50) {
    return {
      bar: "bg-blue-600",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    };
  }

  if (progress >= 25) {
    return {
      bar: "bg-amber-600",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    };
  }

  return {
    bar: "bg-red-600",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
  };
}

/**
 * Get pass chance color classes
 */
export function getPassChanceColor(passChance: number): {
  text: string;
  badge: string;
} {
  if (passChance >= 75) {
    return {
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    };
  }

  if (passChance >= 50) {
    return {
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    };
  }

  if (passChance >= 25) {
    return {
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    };
  }

  return {
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
  };
}
