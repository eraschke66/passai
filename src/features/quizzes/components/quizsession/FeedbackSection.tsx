import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  Loader2,
  Star,
} from "lucide-react";
import type { QuestionResult, Question } from "../../types/quiz";
import type { GradingResult } from "../../services/aiGradingService";

interface FeedbackSectionProps {
  hasSubmitted: boolean;
  results: QuestionResult[];
  currentQuestion: Question;
  isGrading?: boolean;
  gradingResult?: GradingResult;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  hasSubmitted,
  results,
  currentQuestion,
  isGrading = false,
  gradingResult,
}) => {
  if (!hasSubmitted && !isGrading) return null;

  // Show grading spinner for AI-graded questions
  if (isGrading) {
    return (
      <div className="p-4 lg:p-5 rounded-xl border-2 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Loader2 className="w-6 h-6 text-blue-600 shrink-0 animate-spin" />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-1">
              🤖 Grading your answer...
            </h3>
            <p className="text-sm text-slate-700">
              Our AI is analyzing your response. This usually takes 2-3 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const latestResult = results[results.length - 1];
  const isOpenEnded =
    currentQuestion.type === "short-answer" || currentQuestion.type === "essay";

  // For AI-graded questions, show enhanced feedback
  if (isOpenEnded && gradingResult) {
    const scoreColor =
      gradingResult.score >= 90
        ? "text-emerald-600"
        : gradingResult.score >= 70
        ? "text-blue-600"
        : gradingResult.score >= 50
        ? "text-amber-600"
        : "text-red-600";

    const bgColor =
      gradingResult.score >= 70
        ? "bg-emerald-50 border-emerald-200"
        : "bg-amber-50 border-amber-200";

    return (
      <div className={`p-4 lg:p-5 rounded-xl border-2 mb-6 ${bgColor}`}>
        <div className="flex items-start gap-3 mb-3">
          {gradingResult.isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <Star className="w-6 h-6 text-amber-600 shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-slate-900">
                {gradingResult.isCorrect ? "✓ Great Answer!" : "Partial Credit"}
              </h3>
              <span className={`text-lg font-bold ${scoreColor}`}>
                {gradingResult.score}/100
              </span>
            </div>

            {/* AI Feedback */}
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Feedback:
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {gradingResult.feedback}
              </p>
            </div>

            {/* Key Points */}
            {gradingResult.keyPoints &&
              (gradingResult.keyPoints.captured.length > 0 ||
                gradingResult.keyPoints.missed.length > 0) && (
                <div className="space-y-2">
                  {gradingResult.keyPoints.captured.length > 0 && (
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-800 mb-1.5">
                        ✓ What you got right:
                      </p>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {gradingResult.keyPoints.captured.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {gradingResult.keyPoints.missed.length > 0 && (
                    <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <p className="text-xs font-bold text-amber-800 mb-1.5">
                        � To earn the missing {100 - gradingResult.score}{" "}
                        points:
                      </p>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {gradingResult.keyPoints.missed.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            {/* Model Answer */}
            {!gradingResult.isCorrect && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-1">
                  📖 Model Answer:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentQuestion.correct_answer}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard feedback for MC/TF questions
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
