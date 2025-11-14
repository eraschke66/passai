import React, { useState } from "react";
import { Clock, Home, RotateCcw, Target, Trophy } from "lucide-react";
import { GardenProgress } from "../garden/GardenProgress"; // Assume refactored
import type { QuestionResult, Question } from "../../types/quiz";
import { ScoreCard } from "./ScoreCard";
import { QuickStatsGrid } from "./QuickStatsGrid";
import { GardenTeaser } from "./GardenTeaser";
import { QuestionReviewList } from "../quizsession/QuestionReviewList";

interface QuizResultsPageProps {
  quizTitle: string;
  subject: string;
  subjectColor: string;
  results: QuestionResult[];
  questions: Question[];
  onExit?: () => void;
}

export const QuizResultsPage: React.FC<QuizResultsPageProps> = (props) => {
  const [showGarden, setShowGarden] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  const totalQuestions = props.results.length;
  const correctAnswers = props.results.filter((r) => r.isCorrect).length;
  const wrongAnswers = props.results.filter(
    (r) => !r.isCorrect && r.wasAnswered
  ).length;
  const unanswered = props.results.filter((r) => !r.wasAnswered).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const totalTimeSpent = props.results.reduce((acc, r) => acc + r.timeSpent, 0);
  const averageTimePerQuestion = Math.round(totalTimeSpent / totalQuestions);

  const pointsEarned = correctAnswers * 10 + Math.floor(score / 10) * 5;
  const previousLevel = 3; // Mock
  const previousProgress = 65; // Mock
  const newProgress = Math.min(previousProgress + pointsEarned / 10, 100);

  const getScoreMessage = () => {
    if (score >= 90)
      return {
        title: "Outstanding! 🌟",
        message: "You've mastered this material!",
      };
    if (score >= 75)
      return {
        title: "Great Job! 💪",
        message: "You're well on your way to mastery!",
      };
    if (score >= 60)
      return {
        title: "Good Effort! 👍",
        message: "Keep practicing to improve!",
      };
    return {
      title: "Keep Going! 🚀",
      message: "Review the material and try again!",
    };
  };

  const scoreMsg = getScoreMessage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-8">
      <div
        className={`px-4 py-6 lg:px-8 lg:py-8 bg-${props.subjectColor}-600 border-b border-white/20`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Quiz Complete!
          </h1>
          <p className="text-white/90 text-base lg:text-lg font-medium">
            {props.quizTitle}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 space-y-6">
        <ScoreCard score={score} scoreMsg={scoreMsg} />
        <QuickStatsGrid
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          unanswered={unanswered}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Total Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatTime(totalTimeSpent)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Avg:{" "}
              <span className="font-bold text-slate-900">
                {averageTimePerQuestion}s
              </span>{" "}
              per question
            </p>
          </div>
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(
                    (correctAnswers / (totalQuestions - unanswered)) * 100
                  ) || 0}
                  %
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Answered:{" "}
              <span className="font-bold text-slate-900">
                {totalQuestions - unanswered}/{totalQuestions}
              </span>
            </p>
          </div>
        </div>
        <GardenTeaser
          pointsEarned={pointsEarned}
          newProgress={newProgress}
          onViewGarden={() => setShowGarden(true)}
          subject={props.subject}
        />
        <QuestionReviewList
          results={props.results}
          questions={props.questions}
          onDetailedReview={() => setShowDetailedReview(true)}
        />
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={props.onExit}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              /* Retake logic */
            }}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake</span>
          </button>
        </div>
      </div>
      {showGarden && (
        <GardenProgress
          subject={props.subject}
          subjectColor={props.subjectColor}
          level={3}
          progress={newProgress}
          pointsEarned={pointsEarned}
          plantHealth={85}
          onClose={() => setShowGarden(false)}
        />
      )}
    </div>
  );
};
