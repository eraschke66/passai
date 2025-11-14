import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { QuizAttempt } from "../../types/quiz";
import { formatTimeInMinutes } from "../../utils/timeUtils";

interface SummaryStatsProps {
  attempt: QuizAttempt;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ attempt }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-emerald-600 mb-1">
          {attempt.correct_answers}
        </p>
        <p className="text-xs text-slate-600 font-medium">Correct</p>
      </div>
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-red-600 mb-1">
          {attempt.total_questions - attempt.correct_answers}
        </p>
        <p className="text-xs text-slate-600 font-medium">Wrong</p>
      </div>
      <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
        <p className="text-2xl font-bold text-slate-900 mb-1">
          {formatTimeInMinutes(attempt.time_spent)}
        </p>
        <p className="text-xs text-slate-600 font-medium">Time Spent</p>
      </div>
    </div>
  );
};
