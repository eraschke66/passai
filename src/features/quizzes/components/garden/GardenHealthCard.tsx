/**
 * GardenHealthCard Component
 *
 * Reusable card showing garden health status.
 * Can be used in Dashboard, Subject pages, etc.
 */

import React from "react";
import { Sprout } from "lucide-react";

interface GardenHealthCardProps {
  health: number | null;
  emoticon: string;
  statusLabel: string;
  isLoading?: boolean;
  className?: string;
}

export const GardenHealthCard: React.FC<GardenHealthCardProps> = ({
  health,
  emoticon,
  statusLabel,
  isLoading = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
          <Sprout className="w-6 h-6 text-green-600" />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase">
          Garden
        </span>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-slate-900">
              {health !== null ? `${health}%` : "--"}
            </p>
            <span className="text-2xl" role="img" aria-label="garden status">
              {emoticon}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {health !== null ? statusLabel : "Start studying to grow"}
          </p>
        </>
      )}
    </div>
  );
};
