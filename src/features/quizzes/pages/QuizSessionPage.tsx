import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QuizSession } from "../components/quizsession/QuizSession";
import { useQuiz } from "../hooks/useQuiz";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useActiveAttempt } from "../hooks/useActiveAttempt";
import {
  getAttemptAnswers,
  getAttemptById,
} from "../services/quizAttemptService";
import type { QuestionResult } from "../types/quiz";

export const QuizSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const quizId = id || "";
  const { user } = useAuth();
  const userId = user?.id || "";

  // Check if specific attemptId was passed via state
  const stateAttemptId = location.state?.attemptId as string | undefined;

  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useQuiz(quizId);
  const { data: activeAttempt, isLoading: attemptLoading } = useActiveAttempt(
    userId,
    quizId
  );

  const [resumeData, setResumeData] = useState<{
    attemptId: string;
    currentIndex: number;
    results: QuestionResult[];
  } | null>(null);
  const [loadingResume, setLoadingResume] = useState(false);

  const isLoading = quizLoading || (attemptLoading && !stateAttemptId);
  const error = quizError;

  // Load resume data if there's an attempt to resume
  useEffect(() => {
    const loadResumeData = async () => {
      if (resumeData) return; // Already loaded

      let attemptToUse = activeAttempt;

      // If specific attemptId was passed, fetch that attempt
      if (stateAttemptId) {
        try {
          const specificAttempt = await getAttemptById(stateAttemptId);
          if (specificAttempt) {
            attemptToUse = specificAttempt;
          }
        } catch (err) {
          console.error("Failed to fetch specific attempt:", err);
        }
      }

      // If we have an attempt to resume, load its data
      if (attemptToUse?.id) {
        setLoadingResume(true);
        try {
          const answers = await getAttemptAnswers(attemptToUse.id);
          setResumeData({
            attemptId: attemptToUse.id,
            currentIndex: attemptToUse.current_question_index || 0,
            results: answers,
          });
        } catch (err) {
          console.error("Failed to load resume data:", err);
        } finally {
          setLoadingResume(false);
        }
      }
    };

    loadResumeData();
  }, [stateAttemptId, activeAttempt, resumeData]);

  // Redirect if no quiz found
  useEffect(() => {
    if (!isLoading && !quiz) {
      navigate("/quizzes");
    }
  }, [quiz, isLoading, navigate]);

  // Warn users before leaving the page during an active quiz
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Modern browsers show a generic message
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle exit from quiz
  const handleExit = () => {
    // Invalidate quiz attempts cache so detail page shows updated data
    queryClient.invalidateQueries({ queryKey: ["quizAttempts", quizId] });
    queryClient.invalidateQueries({
      queryKey: ["activeAttempt", userId, quizId],
    });
    navigate(`/quizzes/${quizId}`);
  };

  // Show loading state
  if (isLoading || loadingResume) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">
            {loadingResume ? "Loading your progress..." : "Loading quiz..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Quiz not found
          </p>
          <p className="text-sm text-slate-600 mb-4">
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/quizzes")}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizSession
      quizId={quiz.id}
      quizTitle={quiz.title}
      subject={quiz.subject}
      subjectId={quiz.subject_id}
      subjectColor={quiz.subject_color}
      totalQuestions={quiz.questions_count}
      attemptId={resumeData?.attemptId}
      initialQuestionIndex={resumeData?.currentIndex}
      initialResults={resumeData?.results}
      onExit={handleExit}
    />
  );
};
