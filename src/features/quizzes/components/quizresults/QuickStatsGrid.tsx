import React from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface QuickStatsGridProps {
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  correctAnswers,
  wrongAnswers,
  unanswered,
}) => {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50">
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <p className="text-2xl font-bold text-emerald-600">
            {correctAnswers}
          </p>
        </div>
        <p className="text-xs font-medium text-slate-600">Correct</p>
      </div>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <XCircle className="w-4 h-4 text-red-600" />
          <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
        </div>
        <p className="text-xs font-medium text-slate-600">Wrong</p>
      </div>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <p className="text-2xl font-bold text-amber-600">{unanswered}</p>
        </div>
        <p className="text-xs font-medium text-slate-600">Skipped</p>
      </div>
    </div>
  );
};
