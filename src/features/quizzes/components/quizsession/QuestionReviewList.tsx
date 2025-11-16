import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Brain,
} from "lucide-react";
import type { QuestionResult, Question } from "../../types/quiz";

interface QuestionReviewListProps {
  results: QuestionResult[];
  questions: Question[];
  // onDetailedReview: () => void;
}

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({
  results,
  questions,
  // onDetailedReview,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 lg:p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-blue-600" />
        Question Review
      </h3>
      <div className="space-y-2 mb-4">
        {results.map((result, idx) => {
          const question = questions.find((q) => q.id === result.questionId);
          if (!question) return null;
          return (
            <div
              key={result.questionId}
              className={`p-3 rounded-xl border-2 ${
                result.isCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : result.wasAnswered
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {result.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : result.wasAnswered ? (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    Question {idx + 1}
                  </p>
                  <p className="text-xs text-slate-600">{question.topic}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    result.isCorrect
                      ? "bg-emerald-600 text-white"
                      : result.wasAnswered
                      ? "bg-red-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {result.isCorrect ? "✓" : result.wasAnswered ? "✗" : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <button
        // onClick={onDetailedReview}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl transition-colors border-2 border-blue-200"
      >
        <span>View Detailed Review</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
