/**
 * Prompt building for garden-themed study plan generation
 * Uses warm, encouraging language that makes students feel capable
 */

import type {
    GardenStage,
    TopicMastery,
    TopicPerformance,
} from "./database.ts";

export interface StudyPlanSettings {
    subjectName: string;
    testDate: string | null;
    availableHoursPerWeek: number;
    currentPassChance: number | null;
}

/**
 * Build the system prompt with garden metaphor and warm tone
 */
export function buildSystemPrompt(): string {
    return `You are a warm, encouraging educational guide who uses the garden metaphor to help students grow their understanding.

**YOUR ROLE:**
You're like a master gardener helping students nurture their knowledge garden. Your language should be:
- Warm and encouraging (not clinical or cold)
- Growth-oriented (everything is about development, not failure)
- Specific and actionable (clear steps, not vague advice)
- Autonomy-preserving (suggestions, not commands)

**GARDEN METAPHOR LANGUAGE PATTERNS:**

✅ DO SAY:
- "Your [topic] seedling needs water" (not "needs practice")
- "Your garden is growing steadily"
- "This will grow your seedling to 🌿 (60%)"
- "Just 30 minutes will help this bloom"
- "Keep watering - you're doing great"

❌ DON'T SAY:
- "You're behind schedule"
- "More practice needed"
- "Failed" or "incorrect"
- "High priority" or "critical"
- "0/20 tasks completed"
- "Needs attention ⚠️"

**GARDEN STAGES:**
- 🌱 Seedling (0-39%) - "Your seedling is sprouting - it needs water"
- 🌿 Growing (40-59%) - "Your plant is growing steadily"
- 🌻 Blooming (60-74%) - "Your plant is blooming beautifully"  
- 🌳 Thriving (75-100%) - "Your plant is thriving - full mastery!"

**RESPONSE FORMAT:**
You MUST respond with valid JSON in this exact structure:
{
  "gardenHealth": 56, // Overall mastery percentage (0-100)
  "encouragement": "Your English garden is growing steadily. You're 56% there - over halfway to full bloom!",
  "topics": [
    {
      "name": "Topic name (e.g., 'Family Dynamics')",
      "gardenStage": "🌱" | "🌿" | "🌻" | "🌳",
      "masteryLevel": 45, // Current mastery percentage
      "encouragement": "Your Family Dynamics seedling is sprouting! Just a little water each day helps it grow.",
      "timeToNextStage": 30, // Minutes to next garden stage
      "recommendations": [
        {
          "title": "Review character relationships in your materials",
          "description": "Focus on how family dynamics drive character decisions in the stories you've studied",
          "taskType": "review" | "practice" | "reading" | "exercise" | "video",
          "timeMinutes": 15,
          "outcome": "This addresses both tricky questions and grows your seedling toward 🌿"
        }
        // 3-5 recommendations per topic
      ]
    }
    // Include ALL topics (weak ones first, strong ones last)
  ]
}

**CRITICAL GUIDELINES:**
1. PRIORITIZE WEAKEST FIRST: List topics from weakest (🌱) to strongest (🌳)
2. BE SPECIFIC: "Review character relationships" not "study more"
3. SHOW OUTCOMES: "Grows to 60%" not vague promises
4. BE ENCOURAGING: Celebrate current progress, don't emphasize gaps
5. PRESERVE AUTONOMY: "Want to water this?" not "You must complete"
6. USE GARDEN LANGUAGE: Consistently use growth/water/bloom metaphors

**TASK TYPES:**
- "review": Re-read material, study notes, review concepts
- "practice": Work through practice questions
- "reading": Read specific sections or articles
- "exercise": Complete assignments or problem sets
- "video": Watch educational videos

**TIME ESTIMATES:**
- Be realistic: Most recommendations should be 10-30 minutes
- Time to next stage should be achievable (usually 20-60 min total)
- Show clear path: "Do these 3 things (45 min) → Grow to 🌿"

CRITICAL: Respond ONLY with valid JSON. No explanations outside the JSON object.`;
}

/**
 * Build the user prompt with student context and performance data
 */
export function buildUserPrompt(
    settings: StudyPlanSettings,
    topicMastery: TopicMastery[],
    quizPerformance: {
        byTopic: Map<string, TopicPerformance>;
        weakTopics: TopicPerformance[];
        strongTopics: TopicPerformance[];
    },
    attempt: {
        score: number;
        correct_answers: number;
        total_questions: number;
    },
): string {
    // Calculate days until test
    const daysUntilTest = settings.testDate
        ? Math.ceil(
            (new Date(settings.testDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
        )
        : 30;

    // Calculate garden health (average mastery)
    const gardenHealth = topicMastery.length > 0
        ? Math.round(
            topicMastery.reduce((sum, t) => sum + t.mastery_level, 0) /
                topicMastery.length,
        )
        : settings.currentPassChance || 50;

    // Build mastery overview
    const masteryOverview = topicMastery.length > 0
        ? topicMastery
            .map(
                (t) =>
                    `- ${t.topic_name}: ${t.mastery_level}% (${
                        getStageEmoji(t.mastery_level)
                    }) - ${t.correct_count}/${t.total_attempts} correct`,
            )
            .join("\n")
        : "No mastery data yet - student is just starting their garden";

    // Build quiz performance summary
    const quizSummary = `
Recent Quiz Performance:
- Overall Score: ${attempt.score}%
- Correct: ${attempt.correct_answers}/${attempt.total_questions}
`;

    // Build weak topics detail
    const weakTopicsDetail = quizPerformance.weakTopics.length > 0
        ? quizPerformance.weakTopics
            .map((t) => {
                const mistakes = t.incorrectQuestions.slice(0, 2)
                    .map(
                        (q) =>
                            `  * ${
                                q.question.substring(0, 80)
                            }... (answered: ${q.userAnswer})`,
                    )
                    .join("\n");
                return `- ${t.topic}: ${t.percentage}% correct (${t.correctCount}/${t.totalCount})\n${mistakes}`;
            })
            .join("\n\n")
        : "No weak areas identified - student is doing well across all topics";

    const prompt =
        `Create a garden-themed study plan for ${settings.subjectName}.

STUDENT CONTEXT:
- Subject: ${settings.subjectName}
- Days until test: ${daysUntilTest}
- Available study time: ${settings.availableHoursPerWeek} hours/week
- Current garden health: ${gardenHealth}%
- Current pass chance: ${settings.currentPassChance || "Not yet calculated"}%

TOPIC MASTERY (From BKT System):
${masteryOverview}

${quizSummary}

AREAS THAT NEED WATERING (Weak Performance):
${weakTopicsDetail}

STRONG AREAS (For Reinforcement):
${
            quizPerformance.strongTopics.length > 0
                ? quizPerformance.strongTopics
                    .map((t) =>
                        `- ${t.topic}: ${t.percentage}% correct - ${
                            getStageEmoji(t.percentage)
                        }`
                    )
                    .join("\n")
                : "Building strong areas through practice"
        }

YOUR TASK:
1. Create a warm, encouraging study plan using garden metaphor
2. Focus on the weakest topics first (seedlings that need water)
3. Provide 3-5 specific, actionable recommendations per topic
4. Show clear outcomes: "Do X (Y minutes) → Grow to [stage]"
5. Be realistic with time estimates
6. Celebrate progress: "Your garden is at ${gardenHealth}% - you're growing!"

Remember: The goal is to make the student feel CAPABLE, not overwhelmed.
Show them a clear, achievable path forward with specific steps.

Generate the study plan in JSON format as specified in the system prompt.`;

    return prompt;
}

/**
 * Helper to get emoji for mastery level
 */
function getStageEmoji(masteryLevel: number): string {
    if (masteryLevel < 40) return "🌱";
    if (masteryLevel < 60) return "🌿";
    if (masteryLevel < 75) return "🌻";
    return "🌳";
}
