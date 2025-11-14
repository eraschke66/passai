import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "../../types/quiz";

interface AnswerOptionsProps {
  currentQuestion: Question;
  selectedAnswer: string;
  hasSubmitted: boolean;
  setSelectedAnswer: (answer: string) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  currentQuestion,
  selectedAnswer,
  hasSubmitted,
  setSelectedAnswer,
}) => {
  return (
    <div className="space-y-3 mb-6">
      {currentQuestion.options?.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        // For multiple-choice: correct_answer is the index, not the text
        const correctIndex =
          currentQuestion.type === "multiple-choice"
            ? parseInt(currentQuestion.correct_answer, 10)
            : -1;
        const isCorrect =
          currentQuestion.type === "multiple-choice"
            ? idx === correctIndex
            : option.toLowerCase() ===
              currentQuestion.correct_answer.toLowerCase();
        const showResult = hasSubmitted;
        let optionClass =
          "bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900";
        if (showResult) {
          if (isCorrect)
            optionClass =
              "bg-emerald-50 border-2 border-emerald-500 text-emerald-900";
          else if (isSelected && !isCorrect)
            optionClass = "bg-red-50 border-2 border-red-500 text-red-900";
          else
            optionClass =
              "bg-slate-50 border-2 border-slate-200 text-slate-600";
        } else if (isSelected)
          optionClass = "bg-blue-50 border-2 border-blue-500 text-blue-900";

        return (
          <button
            key={idx}
            onClick={() => !hasSubmitted && setSelectedAnswer(option)}
            disabled={hasSubmitted}
            className={`w-full text-left px-4 lg:px-5 py-3 lg:py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${optionClass} ${
              hasSubmitted ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
