import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "../../types/quiz";

interface QuestionsReviewProps {
  questions: QuizQuestion[];
}

export const QuestionsReview: React.FC<QuestionsReviewProps> = ({
  questions,
}) => {
  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className={`p-4 rounded-xl border-2 ${
            q.isCorrect
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3 mb-2">
            {q.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-900 mb-1">
                Question {idx + 1}
              </p>
              <p className="text-sm text-slate-700 mb-3">{q.question}</p>
              <div className="space-y-2">
                <div
                  className={`p-2 rounded-lg ${
                    q.isCorrect ? "bg-white" : "bg-red-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-600 mb-0.5">
                    Your Answer:
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {q.userAnswer}
                  </p>
                </div>
                {!q.isCorrect && (
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <p className="text-xs font-semibold text-slate-600 mb-0.5">
                      Correct Answer:
                    </p>
                    <p className="text-sm font-medium text-emerald-900">
                      {q.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
              <span className="inline-block mt-2 text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded">
                Topic: {q.topic}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
