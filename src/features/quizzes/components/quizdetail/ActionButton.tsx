import React from "react";
import { Play, RotateCcw, PlusCircle } from "lucide-react";
import type { QuizAttempt } from "../../types/quiz";

interface ActionButtonProps {
  attempts: QuizAttempt[];
  onStart: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  attempts,
  onStart,
}) => {
  const hasInProgress = attempts.some((a) => a.status === "in_progress");
  const hasNoAttempts = attempts.length === 0;
  const allCompleted = attempts.length > 0 && !hasInProgress;

  // No attempts yet - Show "Take Quiz"
  if (hasNoAttempts) {
    return (
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
      >
        <Play className="w-5 h-5" />
        <span>Take Quiz</span>
      </button>
    );
  }

  // All attempts completed - Show "Retake Quiz"
  if (allCompleted) {
    return (
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Retake Quiz</span>
      </button>
    );
  }

  // Has in-progress attempts - Show "Start New Attempt"
  return (
    <button
      onClick={onStart}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
    >
      <PlusCircle className="w-4 h-4" />
      <span>Start New Attempt</span>
    </button>
  );
};
