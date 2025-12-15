// ⚠️ TODO: Migrate to Edge Function (Future Task)
// This file still uses the deprecated frontend OpenAI client.
// Should be migrated to Edge Function similar to quiz generation and grading.

import { openai } from "@/lib/ai/openai"; // TODO: Migrate to Edge Function
import { supabase } from "@/lib/supabase/client";

type GeneratedStudyPlan = {
  title: string;
  description: string;
  total_hours: number;
  projected_pass_chance: number;
  topics: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    total_time_minutes: number;
    tasks: Array<{
      title: string;
      description: string;
      task_type: "review" | "practice" | "reading" | "exercise" | "video";
      estimated_time_minutes: number;
    }>;
  }>;
};

/**
 * Generate a personalized study plan using OpenAI based on quiz performance
 */
export const generateStudyPlan = async (settings: {
  subjectId: string;
  subjectName: string;
  testDate: string | null;
  availableHoursPerWeek: number;
  currentPassChance: number | null;
  quizAttemptId: string;
}): Promise<GeneratedStudyPlan> => {
  const {
    subjectName,
    testDate,
    availableHoursPerWeek,
    currentPassChance,
    quizAttemptId,
  } = settings;

  // Fetch quiz performance data
  const quizPerformance = await fetchQuizPerformanceData(quizAttemptId);

  // Calculate days until test
  const daysUntilTest = testDate
    ? Math.ceil(
      (new Date(testDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    )
    : 30; // Default to 30 days if no test date

  // Build system prompt
  const systemPrompt = `
You are an expert educational study planner and learning strategist. Your task is to create highly personalized, effective study plans that help students master their subjects and pass their exams.

CRITICAL REQUIREMENTS:
1. You MUST respond with a valid JSON object containing study plan data
2. The response format MUST be: {"title": "...", "description": "...", "total_hours": X, "projected_pass_chance": Y, "topics": [...]}
3. No additional text, explanations, or markdown formatting outside the JSON
4. Create 4-7 prioritized topics based on the student's weaknesses
5. Each topic should have 5-10 actionable tasks
6. Tasks must be specific, measurable, and time-bound

Your study plan should:
1. Prioritize weak areas identified from quiz performance
2. Balance breadth (covering all topics) with depth (mastering difficult concepts)
3. Include varied learning activities (review, practice, reading, exercises, videos)
4. Be realistic given the available study time
5. Build progressively from easier to harder concepts
6. Include regular practice and self-assessment opportunities

Task types you can use:
- "review": Re-read material, study notes, review concepts
- "practice": Work through practice problems, exercises
- "reading": Read specific chapters, articles, or sections
- "exercise": Complete specific assignments or problem sets
- "video": Watch educational videos or lectures

Priority levels:
- "high": Critical topics with low performance that significantly impact passing
- "medium": Important topics that need improvement
- "low": Topics for reinforcement and maintaining knowledge

Time allocation:
- Be realistic about what can be achieved in the available time
- High-priority topics should get more time
- Include buffer time for review and rest
`;

  // Build user prompt
  const userPrompt = `
Create a personalized study plan for a student preparing for their ${subjectName} exam.

STUDENT CONTEXT:
- Subject: ${subjectName}
- Days until test: ${daysUntilTest} days
- Available study time: ${availableHoursPerWeek} hours per week
- Current projected pass chance: ${currentPassChance || "Not calculated"}%
- Total available study hours: ${
    Math.floor(
      (daysUntilTest / 7) * availableHoursPerWeek,
    )
  } hours

QUIZ PERFORMANCE ANALYSIS:
${quizPerformance.summary}

Topics with LOW performance (need HIGH priority):
${
    quizPerformance.weakTopics
      .map((t) => `- ${t.name}: ${t.score}% correct`)
      .join("\n")
  }

Topics with MEDIUM performance (need MEDIUM priority):
${
    quizPerformance.mediumTopics
      .map((t) => `- ${t.name}: ${t.score}% correct`)
      .join("\n")
  }

Topics with HIGH performance (need LOW priority for reinforcement):
${
    quizPerformance.strongTopics
      .map((t) => `- ${t.name}: ${t.score}% correct`)
      .join("\n")
  }

Specific mistakes to address:
${
    quizPerformance.incorrectAnswers
      .slice(0, 5)
      .map(
        (q) =>
          `- ${q.topic}: ${q.question} (Student answered: ${q.userAnswer}, Correct: ${q.correctAnswer})`,
      )
      .join("\n")
  }

Response format - you MUST use this EXACT structure:
{
  "title": "Personalized ${subjectName} Study Plan",
  "description": "A focused study plan targeting your weak areas and building comprehensive mastery",
  "total_hours": ${Math.floor((daysUntilTest / 7) * availableHoursPerWeek)},
  "projected_pass_chance": 85, // Realistic projection based on completing this plan (60-95 range)
  "topics": [
    {
      "title": "Topic name (be specific, e.g., 'World War II Causes and Major Battles')",
      "description": "Brief description of what will be covered",
      "priority": "high" | "medium" | "low", // Based on quiz performance
      "total_time_minutes": 180, // Realistic time needed for this topic
      "tasks": [
        {
          "title": "Specific, actionable task (e.g., 'Review Treaty of Versailles and its impact')",
          "description": "More details about what to do and why it's important",
          "task_type": "review" | "practice" | "reading" | "exercise" | "video",
          "estimated_time_minutes": 30 // Realistic time for this specific task
        }
        // 5-10 tasks per topic
      ]
    }
    // 4-7 topics total
  ]
}

IMPORTANT GUIDELINES:
1. Start with HIGH priority topics (student's weak areas)
2. Each topic should have a clear learning objective
3. Tasks should be specific and actionable (not vague like "study more")
4. Total time should not exceed available study hours
5. Include variety in task types to maintain engagement
6. Order tasks within each topic from easier to harder
7. Be encouraging but realistic in the projected pass chance

CRITICAL: Your response MUST be valid JSON. DO NOT include any explanations or text outside the JSON object.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    const jsonResponse: GeneratedStudyPlan = JSON.parse(responseText || "{}");

    console.log("OpenAI Study Plan Response:", jsonResponse);

    // Validate response structure
    if (!jsonResponse.topics || !Array.isArray(jsonResponse.topics)) {
      throw new Error("Invalid study plan structure received from AI");
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan. Please try again.");
  }
};

/**
 * Fetch and analyze quiz performance data
 */
async function fetchQuizPerformanceData(quizAttemptId: string) {
  try {
    // Fetch the quiz attempt with questions and answers
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select(
        `
        *,
        quizzes!inner (
          id,
          title,
          questions (
            id,
            question,
            topic,
            correct_answer,
            options,
            difficulty
          )
        )
      `,
      )
      .eq("id", quizAttemptId)
      .single();

    if (attemptError) throw attemptError;

    // Fetch user answers
    const { data: userAnswers, error: answersError } = await supabase
      .from("user_answers")
      .select("*")
      .eq("attempt_id", quizAttemptId);

    if (answersError) throw answersError;

    // Analyze performance by topic
    const topicPerformance = new Map<
      string,
      { correct: number; total: number }
    >();

    const incorrectAnswers: Array<{
      question: string;
      topic: string;
      userAnswer: string;
      correctAnswer: string;
    }> = [];

    // Type assertion for questions
    const quizzesData = attempt.quizzes as unknown as {
      id: string;
      title: string;
      questions: Array<{
        id: string;
        question: string;
        topic: string;
        correct_answer: string;
        options: string[];
        difficulty: string;
      }>;
    };

    const questions = quizzesData?.questions || [];

    questions.forEach((question) => {
      const topic = question.topic || "General";
      const userAnswer = userAnswers?.find(
        (ua) => ua.question_id === question.id,
      );

      if (!topicPerformance.has(topic)) {
        topicPerformance.set(topic, { correct: 0, total: 0 });
      }

      const perf = topicPerformance.get(topic)!;
      perf.total += 1;

      if (userAnswer?.is_correct) {
        perf.correct += 1;
      } else if (userAnswer) {
        incorrectAnswers.push({
          question: question.question,
          topic: topic,
          userAnswer: userAnswer.user_answer || "No answer",
          correctAnswer: question.correct_answer,
        });
      }
    });

    // Categorize topics by performance
    const weakTopics: Array<{ name: string; score: number }> = [];
    const mediumTopics: Array<{ name: string; score: number }> = [];
    const strongTopics: Array<{ name: string; score: number }> = [];

    topicPerformance.forEach((perf, topic) => {
      const score = Math.round((perf.correct / perf.total) * 100);
      const topicData = { name: topic, score };

      if (score < 60) {
        weakTopics.push(topicData);
      } else if (score < 80) {
        mediumTopics.push(topicData);
      } else {
        strongTopics.push(topicData);
      }
    });

    const summary = `
Quiz Performance Summary:
- Overall Score: ${attempt.score}%
- Correct Answers: ${attempt.correct_answers}/${attempt.total_questions}
- Quiz Title: ${quizzesData?.title || "Unknown"}
- Topics covered: ${topicPerformance.size}
- Weak topics: ${weakTopics.length}
- Medium topics: ${mediumTopics.length}
- Strong topics: ${strongTopics.length}
    `.trim();

    return {
      summary,
      weakTopics,
      mediumTopics,
      strongTopics,
      incorrectAnswers,
    };
  } catch (error) {
    console.error("Error fetching quiz performance data:", error);
    throw new Error("Failed to analyze quiz performance");
  }
}
