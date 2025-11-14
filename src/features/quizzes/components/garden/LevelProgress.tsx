import React from "react";
import { Award } from "lucide-react";

interface LevelProgressProps {
  subjectColor: string;
  level: number;
  displayProgress: number;
  leveledUp: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  subjectColor,
  level,
  displayProgress,
  leveledUp,
}) => {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-linear-to-br ${subjectColor} flex items-center justify-center shadow-lg`}
          >
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">
              Current Level
            </p>
            <p className="text-2xl font-bold text-slate-900">Level {level}</p>
          </div>
        </div>
        {leveledUp && (
          <div className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg animate-bounce">
            Level Up! 🎉
          </div>
        )}
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Growth Progress
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(displayProgress)}%
          </span>
        </div>
        <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-linear-to-r ${subjectColor} rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${displayProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-600">
        {leveledUp
          ? "🎊 Congratulations! You've reached the next level!"
          : `${100 - Math.round(displayProgress)}% until next level`}
      </p>
    </div>
  );
};
