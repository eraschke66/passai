import React from "react";
import { BarChart3, FileQuestion } from "lucide-react";
import type { QuizAttempt } from "../../types/quiz";
import { AttemptCard } from "./AttemptCard";

interface AttemptHistoryProps {
  attempts: QuizAttempt[];
  onSelectAttempt: (attempt: QuizAttempt) => void;
  onContinue?: (attemptId: string) => void;
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({
  attempts,
  onSelectAttempt,
  onContinue,
}) => {
  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
      <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Attempt History
        <span className="ml-auto text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
          {attempts.length} total
        </span>
      </h2>
      {attempts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No attempts yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Start the quiz to see your progress
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <AttemptCard
              key={attempt.id}
              attempt={attempt}
              onClick={() => onSelectAttempt(attempt)}
              attempts={attempts}
              onContinue={onContinue}
            />
          ))}
        </div>
      )}
    </section>
  );
};
