/**
 * Database operations for study plan generation
 */

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Database entity types
export interface Subject {
    id: string;
    name: string;
    exam_board: string | null;
    user_id: string;
}

export interface TopicMastery {
    id: string;
    subject_id: string;
    topic_name: string;
    mastery_level: number;
    correct_count: number;
    incorrect_count: number;
    total_attempts: number;
    p_known: number;
    p_learned: number;
    p_init: number;
    p_transit: number;
    p_guess: number;
    p_slip: number;
    last_practiced_at: string;
}

export interface QuizAttempt {
    id: string;
    quiz_id: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    completed_at: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    topic: string;
    difficulty: string;
    correct_answer: string;
    options: string[] | null;
}

export interface UserAnswer {
    id: string;
    question_id: string;
    user_answer: string;
    is_correct: boolean;
}

export interface GardenStage {
    emoji: "🌱" | "🌿" | "🌻" | "🌳";
    name: string;
    message: string;
    color: string;
}

/**
 * Map mastery level to garden stage
 */
export function getMasteryStage(masteryLevel: number): GardenStage {
    if (masteryLevel < 40) {
        return {
            emoji: "🌱",
            name: "Seedling",
            message: "needs water",
            color: "#FEF3C7", // yellow-100
        };
    }
    if (masteryLevel < 60) {
        return {
            emoji: "🌿",
            name: "Growing",
            message: "developing well",
            color: "#D1FAE5", // green-100
        };
    }
    if (masteryLevel < 75) {
        return {
            emoji: "🌻",
            name: "Blooming",
            message: "strong understanding",
            color: "#FECACA", // red-100
        };
    }
    return {
        emoji: "🌳",
        name: "Thriving",
        message: "mastery achieved",
        color: "#C7D2FE", // indigo-100
    };
}

/**
 * Calculate time needed to reach next garden stage
 */
export function calculateTimeToNextStage(
    currentMastery: number,
    correctRate: number = 0.6,
): number {
    // Determine next threshold
    let nextThreshold: number;
    if (currentMastery < 40) nextThreshold = 40;
    else if (currentMastery < 60) nextThreshold = 60;
    else if (currentMastery < 75) nextThreshold = 75;
    else return 0; // Already at max

    // Calculate mastery points needed
    const pointsNeeded = nextThreshold - currentMastery;

    // Estimate: each question answered correctly gives ~2-3 mastery points
    // Each question takes ~2 minutes
    const questionsNeeded = Math.ceil(pointsNeeded / (correctRate * 2.5));
    const timeMinutes = questionsNeeded * 2;

    return Math.max(10, Math.min(timeMinutes, 60)); // Clamp between 10-60 minutes
}

/**
 * Fetch subject information
 */
export async function fetchSubject(
    supabaseClient: SupabaseClient,
    subjectId: string,
    userId: string,
): Promise<Subject> {
    const { data: subject, error } = await supabaseClient
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .eq("user_id", userId)
        .single();

    if (error || !subject) {
        throw new Error(
            `Subject not found or access denied: ${error?.message}`,
        );
    }

    return subject as Subject;
}

/**
 * Fetch all topic mastery data for a subject
 */
export async function fetchTopicMastery(
    supabaseClient: SupabaseClient,
    subjectId: string,
    userId: string,
): Promise<TopicMastery[]> {
    const { data: mastery, error } = await supabaseClient
        .from("topic_mastery")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("user_id", userId)
        .order("mastery_level", { ascending: true }); // Weakest first

    if (error) {
        console.error("Error fetching topic mastery:", error);
        return []; // Return empty array if no mastery data yet
    }

    return (mastery || []) as TopicMastery[];
}

/**
 * Fetch quiz attempt with questions and answers
 */
export async function fetchQuizAttempt(
    supabaseClient: SupabaseClient,
    quizAttemptId: string,
    userId: string,
): Promise<{
    attempt: QuizAttempt;
    questions: QuizQuestion[];
    answers: UserAnswer[];
}> {
    // Fetch attempt
    const { data: attempt, error: attemptError } = await supabaseClient
        .from("quiz_attempts")
        .select("*")
        .eq("id", quizAttemptId)
        .eq("user_id", userId)
        .single();

    if (attemptError || !attempt) {
        throw new Error(`Quiz attempt not found: ${attemptError?.message}`);
    }

    // Fetch questions for this quiz
    const { data: questions, error: questionsError } = await supabaseClient
        .from("questions")
        .select("*")
        .eq("quiz_id", attempt.quiz_id);

    if (questionsError) {
        throw new Error(`Failed to fetch questions: ${questionsError.message}`);
    }

    // Fetch user answers
    const { data: answers, error: answersError } = await supabaseClient
        .from("user_answers")
        .select("*")
        .eq("attempt_id", quizAttemptId);

    if (answersError) {
        throw new Error(`Failed to fetch answers: ${answersError.message}`);
    }

    return {
        attempt: attempt as QuizAttempt,
        questions: (questions || []) as QuizQuestion[],
        answers: (answers || []) as UserAnswer[],
    };
}

/**
 * Analyze quiz performance by topic
 */
export interface TopicPerformance {
    topic: string;
    correctCount: number;
    totalCount: number;
    percentage: number;
    incorrectQuestions: Array<{
        question: string;
        userAnswer: string;
        correctAnswer: string;
    }>;
}

export function analyzeQuizPerformance(
    questions: QuizQuestion[],
    answers: UserAnswer[],
): {
    byTopic: Map<string, TopicPerformance>;
    weakTopics: TopicPerformance[];
    strongTopics: TopicPerformance[];
} {
    const byTopic = new Map<string, TopicPerformance>();

    questions.forEach((question) => {
        const topic = question.topic || "General";
        const answer = answers.find((a) => a.question_id === question.id);

        if (!byTopic.has(topic)) {
            byTopic.set(topic, {
                topic,
                correctCount: 0,
                totalCount: 0,
                percentage: 0,
                incorrectQuestions: [],
            });
        }

        const perf = byTopic.get(topic)!;
        perf.totalCount += 1;

        if (answer?.is_correct) {
            perf.correctCount += 1;
        } else if (answer) {
            perf.incorrectQuestions.push({
                question: question.question,
                userAnswer: answer.user_answer,
                correctAnswer: question.correct_answer,
            });
        }
    });

    // Calculate percentages
    byTopic.forEach((perf) => {
        perf.percentage = Math.round(
            (perf.correctCount / perf.totalCount) * 100,
        );
    });

    // Categorize
    const weakTopics: TopicPerformance[] = [];
    const strongTopics: TopicPerformance[] = [];

    byTopic.forEach((perf) => {
        if (perf.percentage < 60) {
            weakTopics.push(perf);
        } else if (perf.percentage >= 75) {
            strongTopics.push(perf);
        }
    });

    // Sort by performance
    weakTopics.sort((a, b) => a.percentage - b.percentage);
    strongTopics.sort((a, b) => b.percentage - a.percentage);

    return { byTopic, weakTopics, strongTopics };
}
