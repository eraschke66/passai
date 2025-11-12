/**
 * Material Stats Card
 * Displays total material count with modern design
 */

import type { StudyMaterial } from "../types/material.types";

interface MaterialStatsCardProps {
  materials: StudyMaterial[];
  isLoading?: boolean;
}

export function MaterialStatsCard({
  materials,
  isLoading,
}: MaterialStatsCardProps) {
  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-3 lg:p-4">
      <p className="mb-1 text-xs font-medium text-slate-600 lg:text-sm">
        Total Materials
      </p>
      {isLoading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-slate-200 lg:h-10" />
      ) : (
        <p className="text-xl font-bold text-slate-900 lg:text-3xl">
          {materials.length}
        </p>
      )}
    </div>
  );
}
