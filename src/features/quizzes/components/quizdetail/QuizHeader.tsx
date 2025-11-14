import React from "react";
import { ArrowLeft, FileQuestion } from "lucide-react";
import type { QuizAttempt, QuizWithSubject } from "../../types/quiz";
import { QuickStats } from "./QuickStats";

interface QuizHeaderProps {
  quiz: QuizWithSubject;
  onBack: () => void;
  attempts: QuizAttempt[];
  bestScore: number;
  averageScore: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  quiz,
  onBack,
  attempts,
  bestScore,
  averageScore,
}) => {
  return (
    <div
      className={`px-4 py-4 lg:px-8 lg:py-6 bg-${quiz.subject_color}-600 border-b border-white/20`}
    >
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to Quizzes</span>
        </button>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <FileQuestion className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
              {quiz.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                {quiz.subject}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                {quiz.questions_count} Questions
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold text-white">
                {quiz.duration} min
              </span>
            </div>
          </div>
        </div>
        <p className="text-white/90 text-sm lg:text-base mb-4 max-w-3xl">
          {quiz.description}
        </p>
        <QuickStats
          quiz={quiz}
          attempts={attempts}
          bestScore={bestScore}
          averageScore={averageScore}
        />
      </div>
    </div>
  );
};
