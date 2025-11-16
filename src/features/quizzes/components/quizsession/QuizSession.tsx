import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ArrowRight,
  ChevronRight,
  Flag,
  BookOpen,
  Eye,
} from "lucide-react";
import { MoodCheckModal } from "../moodcheckmodal/MoodCheckModal"; // Assume refactored
import { QuizResultsPage } from "../quizresults/QuizResultsPage";
import { useQuestions } from "../../hooks/useQuestion";
import type { QuestionResult } from "../../types/quiz";
import { QuestionHeader } from "./QuestionHeader";
import { TimerDisplay } from "./TimerDisplay";
import { AnswerOptions } from "./AnswerOptions";
import { FeedbackSection } from "./FeedbackSection";
import { SourceModal } from "./SourceModal";
import { useSaveUserAnswer } from "../../hooks/useSaveUserAnswer";
import { useCompleteQuizAttempt } from "../../hooks/useCompleteQuizAttempt";
import { useLogStudySession } from "../../hooks/useLogStudySession";
import {
  isAnswerCorrect,
  getCorrectAnswerText,
} from "../../utils/answerValidation";

interface QuizSessionProps {
  quizId: string;
  quizTitle: string;
  subject: string;
  subjectId: string; // Add subjectId for garden system
  subjectColor: string;
  totalQuestions: number;
  attemptId?: string; // Optional - if provided, will resume that attempt
  initialQuestionIndex?: number; // Where to start from
  initialResults?: QuestionResult[]; // Previously answered questions
  onExit?: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = (props) => {
  const { data: questions = [], isLoading, error } = useQuestions(props.quizId);
  const { mutate: saveAnswer } = useSaveUserAnswer();
  const { mutate: completeAttempt } = useCompleteQuizAttempt();
  const { mutate: logStudySession } = useLogStudySession();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    props.initialQuestionIndex || 0
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [questionStartTime] = useState(Date.now());
  const [results, setResults] = useState<QuestionResult[]>(
    props.initialResults || []
  );
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [moodCheckCompleted, setMoodCheckCompleted] = useState(false);
  const [userMood, setUserMood] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Safe access to currentQuestion with null check
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isMidpoint =
    currentQuestionIndex === Math.floor(questions.length / 2) &&
    !moodCheckCompleted &&
    results.length === Math.floor(questions.length / 2);

  // Check if current question was already answered (for resume functionality)
  const alreadyAnswered = results.find(
    (r) => r.questionId === currentQuestion?.id
  );

  // Effect to pre-populate answer if resuming and question was already answered
  useEffect(() => {
    if (alreadyAnswered && currentQuestion) {
      setSelectedAnswer(alreadyAnswered.userAnswer);
      setHasSubmitted(alreadyAnswered.wasAnswered);
    } else {
      setSelectedAnswer("");
      setHasSubmitted(false);
    }
  }, [currentQuestionIndex, currentQuestion, alreadyAnswered]);

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return; // Safety check
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const correctAnswerText = getCorrectAnswerText(currentQuestion);

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: "",
      correctAnswer: correctAnswerText,
      isCorrect: false,
      timeSpent,
      wasAnswered: false,
    };
    setResults((prev) => [...prev, result]);
    setHasSubmitted(true);

    // Save progress to database if we have an attemptId (time expired, no answer)
    if (props.attemptId) {
      saveAnswer({
        attemptId: props.attemptId,
        questionId: currentQuestion.id,
        userAnswer: "",
        isCorrect: false,
        timeSpent,
        currentQuestionIndex: currentQuestionIndex + 1,
      });
    }
  }, [
    currentQuestion,
    questionStartTime,
    props.attemptId,
    saveAnswer,
    currentQuestionIndex,
  ]);

  useEffect(() => {
    if (hasSubmitted || isQuizComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasSubmitted, currentQuestionIndex, isQuizComplete, handleTimeUp]);

  useEffect(() => {
    if (isMidpoint) setShowMoodCheck(true);
  }, [currentQuestionIndex, results.length, isMidpoint]);

  const handleSubmitAnswer = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = isAnswerCorrect(currentQuestion, selectedAnswer);
    const correctAnswerText = getCorrectAnswerText(currentQuestion);

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correctAnswer: correctAnswerText,
      isCorrect,
      timeSpent,
      wasAnswered: true,
    };
    setResults((prev) => [...prev, result]);
    setHasSubmitted(true);

    // Save progress to database if we have an attemptId
    if (props.attemptId) {
      saveAnswer({
        attemptId: props.attemptId,
        questionId: currentQuestion.id,
        userAnswer: selectedAnswer,
        isCorrect,
        timeSpent,
        currentQuestionIndex: currentQuestionIndex + 1, // Next question index
      });
    }
  };

  const handleQuestionFeedback = (feedback: "thumbs-up" | "thumbs-down") => {
    setResults((prev) =>
      prev.map((r, idx) =>
        idx === results.length - 1 ? { ...r, feedback } : r
      )
    );
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const correctAnswers = results.filter((r) => r.isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      const totalTimeSpent = results.reduce((acc, r) => acc + r.timeSpent, 0);

      // Complete the quiz attempt in the database
      if (props.attemptId) {
        completeAttempt(
          {
            attemptId: props.attemptId,
            score,
            correctAnswers,
            totalTimeSpent,
            mood: userMood,
          },
          {
            onSuccess: () => {
              // Log study session for garden health calculation and streak tracking
              logStudySession({
                subjectId: props.subjectId,
                durationMinutes: Math.ceil(totalTimeSpent / 60), // Convert seconds to minutes
                mood: userMood as
                  | "confident"
                  | "okay"
                  | "struggling"
                  | "confused"
                  | undefined,
                // TODO: Extract topics from quiz questions when topic tagging is implemented
                // TODO: Track quiz_id reference when we add quiz_attempt_id to study_sessions
              });

              setIsQuizComplete(true);
            },
          }
        );
      } else {
        console.error("No attemptId provided - cannot complete quiz");
        setIsQuizComplete(true); // Show results anyway
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setHasSubmitted(false);
      setTimeLeft(120);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Error loading quiz
          </p>
          <p className="text-sm text-slate-600 mb-4">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <button
            onClick={props.onExit}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-lg font-semibold text-slate-700 mb-2">
            No questions found
          </p>
          <p className="text-sm text-slate-600 mb-4">
            This quiz doesn't have any questions yet.
          </p>
          <button
            onClick={props.onExit}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <QuizResultsPage
        quizTitle={props.quizTitle}
        subject={props.subject}
        subjectId={props.subjectId}
        subjectColor={props.subjectColor}
        results={results}
        questions={questions}
        onExit={props.onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-20 lg:pb-8">
      <div
        className={`px-4 py-3 lg:px-8 lg:py-4 bg-${props.subjectColor}-600 border-b border-white/20 sticky top-0 z-30`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={props.onExit}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Quiz</span>
            </button>
            <TimerDisplay timeLeft={timeLeft} />
          </div>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + (hasSubmitted ? 1 : 0)) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
          <p className="text-white text-xs font-medium mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-5 lg:p-8">
          <QuestionHeader
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            hasSubmitted={hasSubmitted}
            handleQuestionFeedback={handleQuestionFeedback}
          />
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6">
            {currentQuestion.question}
          </h2>
          <AnswerOptions
            currentQuestion={currentQuestion}
            selectedAnswer={selectedAnswer}
            hasSubmitted={hasSubmitted}
            setSelectedAnswer={setSelectedAnswer}
          />
          <FeedbackSection
            hasSubmitted={hasSubmitted}
            results={results}
            currentQuestion={currentQuestion}
          />
          <button
            onClick={() => setShowSourceModal(true)}
            className="w-full mb-6 p-3 lg:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-left group"
          >
            <div className="flex gap-3 ">
              <BookOpen className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Source Snippet
                </p>
                {/* <p className="text-sm font-bold text-slate-900 truncate">
                  {currentQuestion.source_snippet?.material}{" "}
                  * TODO: come back and thing about this source snippet thing
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Page {currentQuestion.source_snippet?.page} • Click to review{" "}
                  * TODO: come back and thing about this source snippet thing
                </p> */}
              </div>
              <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </div>
          </button>
          <div className="flex gap-3">
            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-linear-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all"
              >
                <span>{isLastQuestion ? "View Results" : "Next Question"}</span>
                {isLastQuestion ? (
                  <Flag className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {showSourceModal && (
        <SourceModal
          currentQuestion={currentQuestion}
          onClose={() => setShowSourceModal(false)}
        />
      )}
      {showMoodCheck && (
        <MoodCheckModal
          onComplete={(mood) => {
            setUserMood(mood);
            setMoodCheckCompleted(true);
            setShowMoodCheck(false);
          }}
          currentScore={Math.round(
            (results.filter((r) => r.isCorrect).length / results.length) * 100
          )}
        />
      )}
    </div>
  );
};
