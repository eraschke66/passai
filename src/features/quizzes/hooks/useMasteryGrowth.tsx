/**
 * Hook to track mastery growth after quiz completion
 * Compares before quiz mastery levels with after quiz mastery levels
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { GardenStage } from "@/features/study/types";
import type { Tables } from "@/lib/supabase/types";

export interface TopicGrowth {
  topicName: string;
  beforeStage: GardenStage;
  afterStage: GardenStage;
  beforeMastery: number;
  afterMastery: number;
  improved: boolean;
}

interface QuizAttemptWithAnswers {
  id: string;
  user_answers: {
    question_id: string;
    is_correct: boolean;
  }[];
}

/**
 * Map mastery level to garden stage
 */
const getMasteryStage = (masteryLevel: number): GardenStage => {
  if (masteryLevel < 40) return "🌱";
  if (masteryLevel < 60) return "🌿";
  if (masteryLevel < 75) return "🌻";
  return "🌳";
};

/**
 * Hook to get mastery growth data after quiz completion
 */
export function useMasteryGrowth(
  subjectId: string,
  quizAttemptId: string | null,
  enabled: boolean = true
) {
  const [topicGrowths, setTopicGrowths] = useState<TopicGrowth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !subjectId || !quizAttemptId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchGrowthData() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("User not authenticated");
          setIsLoading(false);
          return;
        }

        // Get quiz attempt to find questions and their topics
        const { data: attemptData, error: attemptError } = await supabase
          .from("quiz_attempts")
          .select(
            `
            id,
            user_answers(
              question_id,
              is_correct
            )
          `
          )
          .eq("id", quizAttemptId!)
          .single();

        if (attemptError) throw attemptError;
        if (!attemptData) throw new Error("Quiz attempt not found");

        const attempt = attemptData as unknown as QuizAttemptWithAnswers;

        // Access responses from the nested query
        const responses = attempt.user_answers || [];

        // Get question topics
        const questionIds = responses.map((r) => r.question_id);

        if (questionIds.length === 0) {
          setTopicGrowths([]);
          setIsLoading(false);
          return;
        }

        const { data: questions, error: questionsError } = await supabase
          .from("questions")
          .select("id, topic")
          .in("id", questionIds)
          .returns<Pick<Tables<"questions">, "id" | "topic">[]>();

        if (questionsError) throw questionsError;

        // Map question responses to topics
        const topicPerformance = new Map<
          string,
          { correct: number; total: number }
        >();

        questions?.forEach((question) => {
          const response = responses.find(
            (r) => r.question_id === question.id
          );
          if (!response) return;

          const current = topicPerformance.get(question.topic) || {
            correct: 0,
            total: 0,
          };
          topicPerformance.set(question.topic, {
            correct: current.correct + (response.is_correct ? 1 : 0),
            total: current.total + 1,
          });
        });

        // Get current mastery data (after quiz)
        const { data: currentMastery, error: masteryError } = await supabase
          .from("topic_mastery")
          .select("topic_name, mastery_level")
          .eq("user_id", user.id)
          .eq("subject_id", subjectId)
          .returns<Pick<Tables<"topic_mastery">, "topic_name" | "mastery_level">[]>();

        if (masteryError) throw masteryError;

        // Calculate growths
        const growths: TopicGrowth[] = [];

        topicPerformance.forEach((perf, topicName) => {
          const afterData = currentMastery?.find(
            (m) => m.topic_name === topicName
          );
          if (!afterData) return;

          const afterMastery = afterData.mastery_level;

          // Estimate "before" mastery by working backwards
          // This is approximate - in production you'd store historical mastery snapshots
          const performance = (perf.correct / perf.total) * 100;
          const estimatedGain = Math.max(1, Math.min(10, performance / 10));

          const beforeMastery = Math.max(0, afterMastery - estimatedGain);

          const beforeStage = getMasteryStage(beforeMastery);
          const afterStage = getMasteryStage(afterMastery);

          growths.push({
            topicName,
            beforeStage,
            afterStage,
            beforeMastery: Math.round(beforeMastery),
            afterMastery: Math.round(afterMastery),
            improved: afterMastery > beforeMastery,
          });
        });

        // Sort by improvement amount (most improved first)
        growths.sort((a, b) => {
          const aGain = a.afterMastery - a.beforeMastery;
          const bGain = b.afterMastery - b.beforeMastery;
          return bGain - aGain;
        });

        if (isMounted) {
          setTopicGrowths(growths);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching mastery growth:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setIsLoading(false);
        }
      }
    }

    fetchGrowthData();

    return () => {
      isMounted = false;
    };
  }, [subjectId, quizAttemptId, enabled]);

  return {
    topicGrowths,
    isLoading,
    error,
    hasGrowth: topicGrowths.some((t) => t.improved),
  };
}
