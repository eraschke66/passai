import { Card } from "@/components/ui/card";

export const SubjectCardSkeleton = () => {
  return (
    <Card className="glass-card p-6 border-2 border-transparent relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Progress Circle */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-40 h-40">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 140 140"
          >
            <circle
              cx="70"
              cy="70"
              r={60}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-100 dark:text-slate-800"
            />
          </svg>

          {/* Center text placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-10 w-20 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse mt-2" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
        <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
      </div>
    </Card>
  );
};
