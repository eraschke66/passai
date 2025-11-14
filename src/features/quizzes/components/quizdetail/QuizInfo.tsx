import React from "react";
import type { QuizWithSubject } from "../../types/quiz";
import { calculateTimeAgo } from "../../utils/quizUtils";

interface QuizInfoProps {
  quiz: QuizWithSubject;
}

export const QuizInfo: React.FC<QuizInfoProps> = ({ quiz }) => {
  const timeAgo = calculateTimeAgo(quiz.created_at);

  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4">
        Quiz Details
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <span className="text-sm text-slate-600 font-medium">Created</span>
          <span className="text-sm font-semibold text-slate-900">
            {timeAgo}
          </span>
        </div>
        {/* <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <span className="text-sm text-slate-600 font-medium">
            Topics Covered
          </span>
          <span className="text-sm font-semibold text-slate-900"> // TODO: Add topics count later
            {quiz.topicsCount}
          </span>
        </div> */}
        <div className="flex items-center justify-between py-2 border-b border-slate-200">
          <span className="text-sm text-slate-600 font-medium">Time Limit</span>
          <span className="text-sm font-semibold text-slate-900">
            {quiz.duration} minutes
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-600 font-medium">Subject</span>
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-lg bg-${quiz.subject_color}-600 text-white`}
          >
            {quiz.subject}
          </span>
        </div>
      </div>
    </section>
  );
};
