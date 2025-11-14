import React from "react";
// import { Zap } from 'lucide-react';

interface CurrentPerformanceProps {
  currentScore: number;
}

export const CurrentPerformance: React.FC<CurrentPerformanceProps> = ({
  currentScore,
}) => {
  const getScoreMessage = () => {
    if (currentScore >= 80) return "You're doing great! 🌟";
    if (currentScore >= 60) return "Good progress so far! 💪";
    return "Keep going, you've got this! 🚀";
  };

  return (
    <div className="mb-6 p-4 bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">
          Current Score
        </span>
        <span className="text-2xl font-bold text-emerald-600">
          {currentScore}%
        </span>
      </div>
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-500"
          style={{ width: `${currentScore}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-emerald-700 mt-2">
        {getScoreMessage()}
      </p>
    </div>
  );
};
