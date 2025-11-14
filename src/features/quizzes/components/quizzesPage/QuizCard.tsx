import React from "react";
import { FileQuestion, Trophy, Calendar, ChevronRight } from "lucide-react";
import type { QuizWithSubject } from "../../types/quiz";
import {
  getDifficultyColor,
  getStatusColor,
  getStatusIcon,
  getScoreColor,
} from "../../utils/quizUtils";

interface QuizCardProps {
  quiz: QuizWithSubject;
  onClick: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick }) => {
  const StatusIcon = getStatusIcon(quiz.status);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-4 lg:p-5 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98] group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Quiz Icon & Subject */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-${quiz.subject_color}-600 flex items-center justify-center shadow-md shrink-0`}
          >
            <FileQuestion className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {quiz.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs lg:text-sm text-slate-600 font-medium">
                {quiz.subject}
              </span>
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span className="text-xs lg:text-sm text-slate-600">
                {quiz.questions_count} questions
              </span>
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              <span className="text-xs lg:text-sm text-slate-600">
                {quiz.duration} min
              </span>
            </div>
          </div>
        </div>
        {/* Quiz Stats - Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getStatusColor(
              quiz.status
            )}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold capitalize">
              {quiz.status.replace("-", " ")}
            </span>
          </div>
        </div>
        {/* Quiz Stats - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
          {quiz.status === "completed" && quiz.score !== undefined && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200`}
            >
              <Trophy className="w-4 h-4 text-slate-600" />
              <span
                className={`text-sm font-bold ${getScoreColor(
                  quiz.score || 0
                )}`}
              >
                {quiz.score}%
              </span>
            </div>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor(
              quiz.status
            )}`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold capitalize">
              {quiz.status.replace("-", " ")}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>
      {/* Mobile Score Display */}
      {quiz.status === "completed" && quiz.score !== undefined && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Score:</span>
          <span
            className={`text-lg font-bold ${getScoreColor(quiz.score || 0)}`}
          >
            {quiz.score}%
          </span>
        </div>
      )}
      {/* Due Date Badge */}
      {quiz.due_date && quiz.status !== "completed" && (
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-amber-600">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-semibold">Due {quiz.due_date}</span>
        </div>
      )}
    </div>
  );
};
