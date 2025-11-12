/**
 * Storage Stats Card
 * Displays storage usage with modern design
 */

interface StorageStatsCardProps {
  used: number; // in bytes
  limit: number; // in bytes
  isLoading?: boolean;
}

export function StorageStatsCard({
  used,
  limit,
  isLoading,
}: StorageStatsCardProps) {
  const usedMB = Math.round(used / (1024 * 1024));
  const limitMB = Math.round(limit / (1024 * 1024));

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-3 lg:p-4">
      <p className="mb-1 text-xs font-medium text-slate-600 lg:text-sm">
        Storage Used
      </p>
      {isLoading ? (
        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-slate-200 lg:h-10" />
      ) : (
        <p className="text-xl font-bold text-blue-600 lg:text-3xl">
          {usedMB}MB
          <span className="ml-2 text-sm font-normal text-slate-600 lg:text-base">
            / {limitMB}MB
          </span>
        </p>
      )}
    </div>
  );
}
