import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Lightbulb } from "lucide-react";
import type { QuestionResult, Question } from "../../types/quiz";

interface FeedbackSectionProps {
  hasSubmitted: boolean;
  results: QuestionResult[];
  currentQuestion: Question;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  hasSubmitted,
  results,
  currentQuestion,
}) => {
  if (!hasSubmitted) return null;

  const latestResult = results[results.length - 1];

  return (
    <div
      className={`p-4 lg:p-5 rounded-xl border-2 mb-6 ${
        latestResult.isCorrect
          ? "bg-emerald-50 border-emerald-200"
          : latestResult.wasAnswered
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {latestResult.isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        ) : latestResult.wasAnswered ? (
          <XCircle className="w-6 h-6 text-red-600 shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        )}
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">
            {latestResult.isCorrect
              ? "✓ Correct!"
              : latestResult.wasAnswered
              ? "✗ Incorrect"
              : "⏱ Time's Up!"}
          </h3>
          {!latestResult.isCorrect && (
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Correct answer:{" "}
              <span className="text-emerald-700">
                {currentQuestion.correct_answer}
              </span>
            </p>
          )}
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4" />
              Explanation:
            </span>
            {currentQuestion.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
