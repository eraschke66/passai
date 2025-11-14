import React from "react";
import type { Quiz, QuizAttempt } from "../../types/quiz";
import { getDifficultyColor } from "../../utils/quizUtils";

interface QuickStatsProps {
  quiz: Quiz;
  attempts: QuizAttempt[];
  bestScore: number;
  averageScore: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  quiz,
  attempts,
  bestScore,
  averageScore,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <p className="text-xs text-white/80 font-medium mb-1">Attempts</p>
        <p className="text-2xl lg:text-3xl font-bold text-white">
          {attempts.length}
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <p className="text-xs text-white/80 font-medium mb-1">Best Score</p>
        <p className="text-2xl lg:text-3xl font-bold text-white">
          {bestScore}%
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <p className="text-xs text-white/80 font-medium mb-1">Average</p>
        <p className="text-2xl lg:text-3xl font-bold text-white">
          {averageScore}%
        </p>
      </div>
      <div
        className={`rounded-xl p-4 border ${getDifficultyColor(
          quiz.difficulty
        )}`}
      >
        <p className="text-xs font-medium mb-1">Difficulty</p>
        <p className="text-2xl lg:text-3xl font-bold capitalize">
          {quiz.difficulty}
        </p>
      </div>
    </div>
  );
};
