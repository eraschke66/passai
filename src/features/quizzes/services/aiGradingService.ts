// DEPRECATED: December 14, 2025
// This file has been migrated to Edge Function: supabase/functions/grade-response/index.ts
// See: src/features/quizzes/services/DEPRECATED_aiGradingService.md for migration details
//
// ⚠️ DO NOT USE - Use supabase.functions.invoke('grade-response', {...}) instead
//
// Keeping file temporarily for reference during testing phase.

import OpenAI from "openai";

// ⚠️ DEPRECATED - This should not be used anymore
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface GradingResult {
  score: number; // 0-100
  isCorrect: boolean; // true if score >= 70
  feedback: string; // Detailed feedback for student
  keyPoints?: {
    captured: string[]; // Points student got right
    missed: string[]; // Points student missed
  };
}

export interface EssayGradingResult extends GradingResult {
  rubricBreakdown?: {
    criterion: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
}

/**
 * Grade a short answer question using AI semantic analysis
 * Fast grading focused on key concept capture
 */
export const gradeShortAnswer = async (
  question: string,
  modelAnswer: string,
  studentAnswer: string,
  context?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  },
): Promise<GradingResult> => {
  const systemPrompt =
    `You are an expert teacher grading short answer questions. 
  
Your task:
1. Compare the student's answer to the model answer
2. Check if the student captured the KEY CONCEPTS (not exact wording)
3. Assign a score from 0-100 based on concept understanding
4. Provide brief, encouraging feedback
5. ALWAYS identify what the student captured AND what they missed

Grading criteria:
- 90-100: Captures all key concepts accurately
- 70-89: Captures most key concepts, minor gaps
- 50-69: Captures some concepts, missing important points
- 30-49: Shows basic understanding but significant gaps
- 0-29: Incorrect or minimal understanding

Be lenient with:
- Different wording (as long as meaning is correct)
- Spelling/grammar (unless it changes meaning)
- Order of information

Be strict with:
- Factual accuracy
- Missing critical concepts
- Contradictions to model answer

IMPORTANT - Key Points Analysis:
- "captured": List ALL concepts/points the student got right (even if partially)
- "missed": List ALL concepts/points the student missed or could improve
- If score < 100, there MUST be items in "missed" array explaining what would earn full marks
- Be specific: Don't say "more detail needed", say exactly what detail is missing
- Example missed point: "Did not mention that energy is converted to chemical form (glucose)"

Respond in JSON format:
{
  "score": <number 0-100>,
  "isCorrect": <boolean, true if score >= 70>,
  "feedback": "<encouraging feedback explaining the grade>",
  "keyPoints": {
    "captured": ["<specific concept student got right>", "<another concept>", ...],
    "missed": ["<specific concept or detail student missed>", "<what would improve the answer>", ...]
  }
}`;

  const userPrompt = `Subject: ${context?.subject || "General"}
Topic: ${context?.topic || "Not specified"}
Difficulty: ${context?.difficulty || "medium"}

QUESTION:
${question}

MODEL ANSWER:
${modelAnswer}

STUDENT ANSWER:
${studentAnswer}

Grade this answer and provide feedback.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for consistent grading
      max_tokens: 500, // Keep it concise for speed
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      score: result.score || 0,
      isCorrect: result.isCorrect || false,
      feedback: result.feedback || "Unable to grade answer.",
      keyPoints: result.keyPoints || { captured: [], missed: [] },
    };
  } catch (error) {
    console.error("Short answer grading error:", error);
    throw new Error("Failed to grade short answer. Please try again.");
  }
};

/**
 * Grade an essay question using rubric-based analysis
 * More detailed grading with rubric breakdown
 */
export const gradeEssay = async (
  question: string,
  modelAnswer: string,
  studentAnswer: string,
  rubric?: string,
  context?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  },
): Promise<EssayGradingResult> => {
  const systemPrompt = `You are an expert teacher grading essay questions.

Your task:
1. Evaluate the student's essay against the model answer and rubric
2. Provide detailed rubric-based grading
3. Assign scores for each rubric criterion
4. Give constructive, specific feedback
5. ALWAYS identify strengths AND specific areas for improvement

Grading approach:
- Focus on content quality, analysis, and reasoning
- Consider structure and organization
- Evaluate evidence and examples
- Check for depth of understanding
- Be encouraging but honest

IMPORTANT - Key Points Analysis:
- "captured": List ALL strengths in the essay (what they did well)
- "missed": List ALL specific improvements needed to reach full marks
- If score < 100, there MUST be actionable items in "missed" array
- Be specific and constructive: Instead of "needs more analysis", say "Should analyze the economic factors that contributed to..."
- Give examples: "Could strengthen thesis by stating a clear position on..."

Respond in JSON format:
{
  "score": <overall score 0-100>,
  "isCorrect": <boolean, true if score >= 70>,
  "feedback": "<detailed overall feedback>",
  "rubricBreakdown": [
    {
      "criterion": "<rubric criterion name>",
      "score": <points earned>,
      "maxScore": <points possible>,
      "feedback": "<specific feedback for this criterion>"
    },
    ...
  ],
  "keyPoints": {
    "captured": ["<specific strength in essay>", "<what they did well>", ...],
    "missed": ["<specific improvement needed>", "<what would earn more points>", ...]
  }
}`;

  const defaultRubric = `
- Content & Understanding (40%): Demonstrates clear understanding of the topic
- Analysis & Critical Thinking (30%): Provides thoughtful analysis and reasoning
- Structure & Organization (15%): Well-organized with clear flow
- Evidence & Examples (15%): Uses relevant evidence to support points
`;

  const userPrompt = `Subject: ${context?.subject || "General"}
Topic: ${context?.topic || "Not specified"}
Difficulty: ${context?.difficulty || "medium"}

QUESTION:
${question}

MODEL ANSWER:
${modelAnswer}

GRADING RUBRIC:
${rubric || defaultRubric}

STUDENT ESSAY:
${studentAnswer}

Grade this essay according to the rubric and provide detailed feedback.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000, // More tokens for detailed essay feedback
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return {
      score: result.score || 0,
      isCorrect: result.isCorrect || false,
      feedback: result.feedback || "Unable to grade essay.",
      rubricBreakdown: result.rubricBreakdown || [],
      keyPoints: result.keyPoints || { captured: [], missed: [] },
    };
  } catch (error) {
    console.error("Essay grading error:", error);
    throw new Error("Failed to grade essay. Please try again.");
  }
};

/**
 * Fast grading with caching support
 * Checks if this exact answer was graded before
 */
const gradingCache = new Map<string, GradingResult>();

const getCacheKey = (questionId: string, studentAnswer: string): string => {
  return `${questionId}:${studentAnswer.trim().toLowerCase()}`;
};

export const gradeWithCache = async (
  questionId: string,
  questionType: "short-answer" | "essay",
  question: string,
  modelAnswer: string,
  studentAnswer: string,
  rubric?: string,
  context?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  },
): Promise<GradingResult> => {
  // Check cache first
  const cacheKey = getCacheKey(questionId, studentAnswer);
  const cached = gradingCache.get(cacheKey);
  if (cached) {
    console.log("Using cached grading result");
    return cached;
  }

  // Grade based on type
  const result = questionType === "essay"
    ? await gradeEssay(question, modelAnswer, studentAnswer, rubric, context)
    : await gradeShortAnswer(question, modelAnswer, studentAnswer, context);

  // Cache the result
  gradingCache.set(cacheKey, result);

  // Limit cache size (keep last 100 gradings)
  if (gradingCache.size > 100) {
    const firstKey = gradingCache.keys().next().value;
    if (firstKey) {
      gradingCache.delete(firstKey);
    }
  }

  return result;
};
