import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
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
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
        {currentQuestion.topic}
      </span>
      {!hasSubmitted && (
        <div className="flex items-center gap-1">
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
  );
};
