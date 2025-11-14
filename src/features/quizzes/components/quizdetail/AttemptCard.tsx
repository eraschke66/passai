import React from "react";
import { Eye, CheckCircle, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizAttempt } from "../../types/quiz";
import { getScoreColor } from "../../utils/quizUtils";
import { formatTimeInMinutes } from "../../utils/timeUtils";
import { calculateTimeAgo } from "../../utils/quizUtils";

interface AttemptCardProps {
  attempt: QuizAttempt;
  onClick: () => void;
  attempts: QuizAttempt[];
  onContinue?: (attemptId: string) => void;
}

export const AttemptCard: React.FC<AttemptCardProps> = ({
  attempt,
  onClick,
  attempts,
  onContinue,
}) => {
  const isInProgress = attempt.status === "in-progress";
  const isCompleted = attempt.status === "completed";

  const timeAge = calculateTimeAgo(attempt.completed_date);

  const handleContinueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContinue) {
      onContinue(attempt.id);
    }
  };

  return (
    <div
      onClick={isCompleted ? onClick : undefined}
      className={`border-2 border-slate-200 rounded-xl p-4 transition-all ${
        isCompleted
          ? "hover:border-blue-400 cursor-pointer hover:shadow-md active:scale-[0.98]"
          : "opacity-90"
      } group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              Attempt #{attempt.attempt_number}
            </h3>
            <p className="text-xs text-slate-600">{timeAge}</p>
          </div>
          {isInProgress && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-md">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">
                In Progress
              </span>
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-md">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Completed
              </span>
            </div>
          )}
        </div>
        <div
          className={`text-right ${
            attempt.attempt_number === attempts[0].attempt_number
              ? "px-2 py-1 bg-blue-50 rounded-lg"
              : ""
          }`}
        >
          {isCompleted && (
            <>
              <p
                className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}
              >
                {attempt.score}%
              </p>
              {attempt.attempt_number === attempts[0].attempt_number && (
                <p className="text-xs text-blue-600 font-semibold">Latest</p>
              )}
            </>
          )}
          {isInProgress && (
            <p className="text-sm font-semibold text-amber-700">
              {attempt.current_question_index || 0}/{attempt.total_questions}{" "}
              answered
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 font-medium mb-0.5">
            {isCompleted ? "Correct" : "Progress"}
          </p>
          <p className="text-lg font-bold text-emerald-600">
            {isCompleted
              ? `${attempt.correct_answers}/${attempt.total_questions}`
              : `${attempt.current_question_index || 0}/${
                  attempt.total_questions
                }`}
          </p>
        </div>
        <div className="text-center p-2 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 font-medium mb-0.5">Time</p>
          <p className="text-lg font-bold text-slate-900">
            {formatTimeInMinutes(attempt.time_spent)}
          </p>
        </div>
        <div
          className={`text-center p-2 rounded-lg ${
            isCompleted ? "bg-blue-50" : "bg-slate-100 opacity-50"
          }`}
        >
          <p
            className={`text-xs font-medium mb-0.5 ${
              isCompleted ? "text-blue-600" : "text-slate-400"
            }`}
          >
            View
          </p>
          <Eye
            className={`w-5 h-5 mx-auto ${
              isCompleted ? "text-blue-600" : "text-slate-400"
            }`}
          />
        </div>
      </div>
      {isInProgress && onContinue && (
        <Button
          onClick={handleContinueClick}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Continue Quiz
        </Button>
      )}
    </div>
  );
};
