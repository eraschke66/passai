import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useQuiz } from "../hooks/useQuiz";
import { useQuizAttempts } from "../hooks/useQuizAttempts";
import type { QuizAttempt } from "../types/quiz";
import { QuizHeader } from "../components/quizdetail/QuizHeader";
import { ScoreProgressionChart } from "../components/quizdetail/ScoreProgressionChart";
import { AttemptHistory } from "../components/quizdetail/AttemptHistory";
import { QuizMaterials } from "../components/quizdetail/QuizMaterials";
import { QuizInfo } from "../components/quizdetail/QuizInfo";
import { ActionButton } from "../components/quizdetail/ActionButton";
import { AttemptDetailModal } from "../components/quizdetail/AttemptDetailModal";
import { useQuizMaterials } from "../hooks/useMaterials";
import { useCreateQuizAttempt } from "../hooks/useCreateQuizAttempt";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const QuizDetailPage = () => {
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(
    null
  );

  const { id } = useParams();
  const quizId = id || "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quiz } = useQuiz(quizId);
  const { data: attempts = [], refetch: refetchAttempts } =
    useQuizAttempts(quizId);
  const { data: quizMaterials = [] } = useQuizMaterials(quizId);
  const { user } = useAuth();
  const userId = user?.id;
  const { mutate: createAttempt } = useCreateQuizAttempt(quizId, userId || "");

  // Refetch attempts when component mounts or when returning from quiz session
  useEffect(() => {
    refetchAttempts();
  }, [refetchAttempts]);

  // Also invalidate queries when window regains focus (user returns from quiz)
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ["quizAttempts", quizId] });
      queryClient.invalidateQueries({
        queryKey: ["activeAttempt", userId, quizId],
      });
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [queryClient, quizId, userId]);

  const onBack = () => {
    navigate("/quizzes");
  };

  const handleStartQuiz = () => {
    // Create attempt first, then navigate to session
    createAttempt(undefined, {
      onSuccess: () => {
        navigate(`/quizzes/${quizId}/session`);
      },
    });
  };

  const handleContinueQuiz = (attemptId: string) => {
    // Navigate to session with specific attemptId
    navigate(`/quizzes/${quizId}/session`, { state: { attemptId } });
  };

  if (!quiz) return null; // Loading or error handling

  const bestScore =
    attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length
        )
      : 0;

  return (
    <div className="h-full overflow-y-auto pb-4">
      <QuizHeader
        quiz={quiz}
        attempts={attempts}
        bestScore={bestScore}
        averageScore={averageScore}
        onBack={onBack}
      />
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScoreProgressionChart
                attempts={attempts}
                bestScore={bestScore}
              />
              <AttemptHistory
                attempts={attempts}
                onSelectAttempt={(attempt) => setSelectedAttempt(attempt)}
                onContinue={handleContinueQuiz}
              />
            </div>
            <div className="space-y-6">
              <QuizMaterials materials={quizMaterials} />
              <QuizInfo quiz={quiz} />
              <ActionButton attempts={attempts} onStart={handleStartQuiz} />
            </div>
          </div>
        </div>
      </div>
      {selectedAttempt && (
        <AttemptDetailModal
          quiz={quiz}
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
          questions={[]}
        />
      )}
    </div>
  );
};
