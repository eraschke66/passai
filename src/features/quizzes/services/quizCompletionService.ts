import { supabase } from "@/lib/supabase/client";
import {
    updateMasteryFromQuizResults,
    updateSubjectPassChance,
} from "@/features/study/services/mastery.service";

/**
 * Quiz Completion Service
 * Handles quiz completion logic and BKT (Bayesian Knowledge Tracing) integration
 */

/**
 * Complete quiz attempt and update BKT mastery
 *
 * This function:
 * 1. Marks the attempt as completed
 * 2. Updates quiz status and score
 * 3. Triggers BKT mastery updates for all concepts covered
 *
 * @param attemptId - ID of the attempt to complete
 * @param score - Final score percentage (0-100)
 * @param correctAnswers - Number of correct answers
 * @param totalTimeSpent - Total time spent in seconds
 * @param mood - Optional mood indicator
 */
export const completeQuizAttempt = async (
    attemptId: string,
    score: number,
    correctAnswers: number,
    totalTimeSpent: number,
    mood?: string | null,
): Promise<void> => {
    console.log("🏁 Completing quiz attempt:", { attemptId, score, mood });

    // First, get the quiz_id from the attempt
    const { data: attemptData, error: fetchError } = await supabase
        .from("quiz_attempts")
        .select("quiz_id")
        .eq("id", attemptId)
        .single();

    if (fetchError) {
        console.error("❌ Error fetching attempt:", fetchError);
        throw fetchError;
    }

    const { error } = await supabase
        .from("quiz_attempts")
        .update({
            status: "completed",
            score,
            correct_answers: correctAnswers,
            time_spent: totalTimeSpent,
            completed_date: new Date().toISOString(),
            mood: mood || null,
        })
        .eq("id", attemptId);

    if (error) {
        console.error("❌ Error completing attempt:", error);
        throw error;
    }

    console.log("✅ Quiz attempt completed");

    // Update the quiz status to completed and update score
    const { error: updateError } = await supabase
        .from("quizzes")
        .update({
            status: "completed",
            score: score,
        })
        .eq("id", attemptData.quiz_id);

    if (updateError) {
        console.error("⚠️ Error updating quiz status:", updateError);
        // Don't throw - attempt was completed successfully
    } else {
        console.log("✅ Quiz status updated to completed");
    }

    // Update BKT mastery after quiz completion
    try {
        await updateMasteryAfterQuiz(attemptId);
        console.log("✅ BKT mastery updated successfully");
    } catch (masteryError) {
        // Log error but don't fail the quiz completion
        console.error("⚠️ Failed to update BKT mastery:", masteryError);
    }
};

/**
 * Update BKT mastery for all topics/concepts covered in a quiz
 * This is called automatically after a quiz is completed
 *
 * Process:
 * 1. Fetches all user answers with question details
 * 2. Groups answers by concept (or topic if concept missing)
 * 3. Updates BKT mastery for each concept based on correctness
 * 4. Updates subject pass chance based on new mastery levels
 *
 * @param attemptId - ID of the completed attempt
 */
export const updateMasteryAfterQuiz = async (
    attemptId: string,
): Promise<void> => {
    console.log("🧠 Updating BKT mastery for attempt:", attemptId);

    // Get the quiz attempt details
    const { data: attempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .select("quiz_id, user_id")
        .eq("id", attemptId)
        .single();

    if (attemptError || !attempt) {
        throw new Error("Quiz attempt not found");
    }

    // Get the subject_id from the quiz
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("subject_id")
        .eq("id", attempt.quiz_id)
        .single();

    if (quizError || !quiz) {
        throw new Error("Quiz not found");
    }

    // Get all user answers for this attempt with question details
    const { data: answers, error: answersError } = await supabase
        .from("user_answers")
        .select(
            `
      *,
      questions!question_id (
        topic,
        concept
      )
    `,
        )
        .eq("attempt_id", attemptId);

    if (answersError) {
        throw answersError;
    }

    if (!answers || answers.length === 0) {
        console.log("⚠️ No answers found for this attempt");
        return;
    }

    // Group answers by concept (or topic if concept is null)
    const answersByTopic = new Map<string, boolean[]>();

    for (const answer of answers) {
        const question = Array.isArray(answer.questions)
            ? answer.questions[0]
            : answer.questions;

        if (!question) continue;

        // Use concept if available, otherwise fall back to topic
        const topicName = question.concept || question.topic;

        if (!answersByTopic.has(topicName)) {
            answersByTopic.set(topicName, []);
        }

        answersByTopic.get(topicName)!.push(answer.is_correct);
    }

    console.log(`📊 Processing ${answersByTopic.size} topics/concepts`);

    // Update BKT mastery for each topic/concept
    const updatePromises = Array.from(answersByTopic.entries()).map(
        async ([topicName, correctnessArray]) => {
            try {
                console.log(
                    `  └─ ${topicName}: ${
                        correctnessArray.filter((c) => c).length
                    }/${correctnessArray.length} correct`,
                );

                const result = await updateMasteryFromQuizResults(
                    quiz.subject_id,
                    topicName,
                    correctnessArray,
                );

                if (result.error) {
                    console.error(
                        `    ❌ Error updating ${topicName}:`,
                        result.error,
                    );
                } else {
                    console.log(
                        `    ✅ ${topicName} mastery: ${result.data?.mastery_level}%`,
                    );
                }

                return result;
            } catch (error) {
                console.error(`    ❌ Exception updating ${topicName}:`, error);
                return { data: null, error: String(error) };
            }
        },
    );

    await Promise.all(updatePromises);

    console.log("✅ BKT mastery updates complete");

    // Update subject pass_chance based on new mastery levels
    try {
        const passChanceResult = await updateSubjectPassChance(quiz.subject_id);
        if (passChanceResult.error) {
            console.error(
                "⚠️ Failed to update pass chance:",
                passChanceResult.error,
            );
        } else {
            console.log(
                `✅ Subject pass chance updated: ${passChanceResult.data}%`,
            );
        }
    } catch (passChanceError) {
        console.error("⚠️ Exception updating pass chance:", passChanceError);
    }
};

/**
 * Get mastery summary for a subject after quiz
 * Useful for showing improvement/progress after completing a quiz
 *
 * @param attemptId - Completed attempt ID
 * @returns Summary with updated topics, average mastery, and categorized topics
 */
export const getMasterySummaryAfterQuiz = async (
    attemptId: string,
): Promise<{
    topicsUpdated: number;
    averageMastery: number;
    improvedTopics: string[];
    needsWorkTopics: string[];
}> => {
    // Get the quiz attempt
    const { data: attempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .select("quiz_id")
        .eq("id", attemptId)
        .single();

    if (attemptError || !attempt) {
        throw new Error("Quiz attempt not found");
    }

    // Get the subject_id
    const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .select("subject_id")
        .eq("id", attempt.quiz_id)
        .single();

    if (quizError || !quiz) {
        throw new Error("Quiz not found");
    }

    // Get current user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        throw new Error("User not authenticated");
    }

    // Get all mastery records for this subject
    const { data: masteryRecords, error: masteryError } = await supabase
        .from("topic_mastery")
        .select("topic_name, mastery_level, last_practiced_at")
        .eq("user_id", user.id)
        .eq("subject_id", quiz.subject_id)
        .order("mastery_level", { ascending: true });

    if (masteryError) {
        throw masteryError;
    }

    if (!masteryRecords || masteryRecords.length === 0) {
        return {
            topicsUpdated: 0,
            averageMastery: 0,
            improvedTopics: [],
            needsWorkTopics: [],
        };
    }

    // Calculate average mastery
    const totalMastery = masteryRecords.reduce(
        (sum, record) => sum + record.mastery_level,
        0,
    );
    const averageMastery = Math.round(totalMastery / masteryRecords.length);

    // Find recently updated topics (updated in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const recentlyUpdated = masteryRecords.filter(
        (record) =>
            record.last_practiced_at &&
            record.last_practiced_at >= fiveMinutesAgo,
    );

    // Categorize topics
    const improvedTopics = recentlyUpdated
        .filter((record) => record.mastery_level >= 70)
        .map((record) => record.topic_name);

    const needsWorkTopics = masteryRecords
        .filter((record) => record.mastery_level < 60)
        .slice(0, 3) // Top 3 weakest topics
        .map((record) => record.topic_name);

    return {
        topicsUpdated: recentlyUpdated.length,
        averageMastery,
        improvedTopics,
        needsWorkTopics,
    };
};
