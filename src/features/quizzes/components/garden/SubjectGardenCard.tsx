import { Sprout } from "lucide-react";

interface SubjectGardenCardProps {
  health: number | null;
  level: number;
  points: number;
  pointsToNextLevel: number;
  emoticon: string;
  statusLabel: string;
  isLoading?: boolean;
  className?: string;
}

/**
 * Garden health card specifically designed for subject detail pages
 * Shows level, points, and progress to next level in addition to health
 */
export function SubjectGardenCard({
  health,
  level,
  points,
  pointsToNextLevel,
  emoticon,
  statusLabel,
  isLoading = false,
  className = "",
}: SubjectGardenCardProps) {
  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Garden Health
          </span>
          <Sprout className="size-5 text-green-600" />
        </div>
        <div className="mb-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-0 bg-green-500" />
        </div>
      </div>
    );
  }

  const healthPercent = health ?? 0;
  const progressPercent = ((points % 100) / 100) * 100;

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Garden Health</span>
        <Sprout className="size-5 text-green-600" />
      </div>

      {/* Health and Emoticon */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-3xl">{emoticon}</span>
        <div className="text-3xl font-bold text-gray-900">{healthPercent}%</div>
      </div>

      {/* Status Label */}
      <p className="mb-3 text-sm font-medium text-gray-600">{statusLabel}</p>

      {/* Level Info */}
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-gray-600">Level {level}</span>
        <span className="text-gray-500">{pointsToNextLevel} pts to next</span>
      </div>

      {/* Progress Bar to Next Level */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
