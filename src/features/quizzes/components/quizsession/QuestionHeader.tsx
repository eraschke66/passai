import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Lightbulb, Brain } from "lucide-react";
import type { Question } from "../../types/quiz";

interface QuestionHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question;
  hasSubmitted: boolean;
  handleQuestionFeedback: (feedback: "thumbs-up" | "thumbs-down") => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  // currentQuestionIndex,
  // totalQuestions,
  currentQuestion,
  hasSubmitted,
  handleQuestionFeedback,
}) => {
  const [showHint, setShowHint] = useState(false);

  const bloomLevelColors: Record<string, string> = {
    remember: "bg-slate-50 text-slate-600 border-slate-200",
    understand: "bg-blue-50 text-blue-600 border-blue-200",
    apply: "bg-purple-50 text-purple-600 border-purple-200",
    analyze: "bg-amber-50 text-amber-600 border-amber-200",
    evaluate: "bg-rose-50 text-rose-600 border-rose-200",
    create: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
            {currentQuestion.topic}
          </span>
          {currentQuestion.bloom_level && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1 ${
                bloomLevelColors[currentQuestion.bloom_level] ||
                bloomLevelColors.understand
              }`}
              title={`Bloom's Taxonomy: ${currentQuestion.bloom_level}`}
            >
              <Brain className="w-3 h-3" />
              {currentQuestion.bloom_level}
            </span>
          )}
        </div>
        {!hasSubmitted && (
          <div className="flex items-center gap-1">
            {currentQuestion.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors group ${
                  showHint
                    ? "bg-amber-100 hover:bg-amber-200"
                    : "hover:bg-slate-100"
                }`}
                title={showHint ? "Hide hint" : "Show hint"}
              >
                <Lightbulb
                  className={`w-4 h-4 ${
                    showHint
                      ? "text-amber-600"
                      : "text-slate-400 group-hover:text-amber-600"
                  }`}
                />
              </button>
            )}
            <button
              onClick={() => handleQuestionFeedback("thumbs-up")}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group"
              title="Good question"
            >
              <ThumbsUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
            <button
              onClick={() => handleQuestionFeedback("thumbs-down")}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors group"
              title="Report issue"
            >
              <ThumbsDown className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
      {!hasSubmitted && showHint && currentQuestion.hint && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-900">{currentQuestion.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};
