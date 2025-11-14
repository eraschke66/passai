import React from "react";
import type { Quiz, QuizQuestion, QuizAttempt } from "../../types/quiz";
import { SummaryStats } from "./SummaryStats";
import { QuestionsReview } from "./QuestionsReview";

interface AttemptDetailModalProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onClose: () => void;
  questions: QuizQuestion[];
}

export const AttemptDetailModal: React.FC<AttemptDetailModalProps> = ({
  quiz,
  attempt,
  onClose,
  questions,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`shrink-0 px-6 py-5 border-b border-slate-200 bg-linear-to-br ${quiz.subjectColor}`}
        >
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                Attempt #{attempt.attemptNumber}
              </h2>
              <p className="text-white/90 text-sm">{attempt.completedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80 font-medium mb-1">Score</p>
              <p className="text-3xl font-bold text-white">{attempt.score}%</p>
            </div>
          </div>
        </div>
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <SummaryStats attempt={attempt} />
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Question Review
          </h3>
          <QuestionsReview questions={questions} />
        </div>
        {/* Modal Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
