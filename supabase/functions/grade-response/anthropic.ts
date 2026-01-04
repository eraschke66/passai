/**
 * Anthropic Claude API integration for answer grading
 * Uses Claude 3.5 Haiku for fast, accurate grading
 */

import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.20.9";

function getAnthropicClient(): Anthropic {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY not configured");
    }
    return new Anthropic({ apiKey });
}

export interface GradingRequest {
    questionType: "short-answer" | "essay";
    question: string;
    modelAnswer: string;
    studentAnswer: string;
    rubric?: string;
    context?: {
        topic?: string;
        difficulty?: string;
    };
}

export interface GradingResult {
    score: number; // 0-100
    isCorrect: boolean; // true if score >= 70
    feedback: string;
    keyPoints?: {
        captured: string[];
        missed: string[];
    };
    rubricBreakdown?: {
        criterion: string;
        score: number;
        maxScore: number;
        feedback: string;
    }[];
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

/**
 * Grade a student's answer using Anthropic Claude
 */
export async function gradeAnswer(
    request: GradingRequest,
): Promise<GradingResult> {
    console.log(
        `🤖 Grading ${request.questionType} with Claude...`,
    );

    const anthropic = getAnthropicClient();

    const systemPrompt = buildSystemPrompt(request.questionType);
    const userPrompt = buildUserPrompt(request);

    const message = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        temperature: 0.3, // Lower temp for consistent grading
        system: systemPrompt,
        messages: [
            {
                role: "user",
                content: userPrompt,
            },
        ],
    });

    const responseText = message.content[0]?.type === "text"
        ? message.content[0].text
        : null;

    if (!responseText) {
        throw new Error("Empty response from Claude");
    }

    // Parse JSON response
    const gradingResult = JSON.parse(responseText);

    // Validate response structure
    if (typeof gradingResult.score !== "number") {
        throw new Error("Invalid grading response: missing score");
    }

    // Ensure isCorrect is boolean (score >= 70)
    gradingResult.isCorrect = gradingResult.score >= 70;

    console.log(`✅ Grading complete: ${gradingResult.score}/100`);

    return {
        ...gradingResult,
        usage: {
            input_tokens: message.usage.input_tokens,
            output_tokens: message.usage.output_tokens,
        },
    };
}

function buildSystemPrompt(questionType: "short-answer" | "essay"): string {
    if (questionType === "essay") {
        return `You are an expert educational assessor specializing in essay grading.

Your task is to grade student essays fairly and constructively, providing detailed feedback.

GRADING PRINCIPLES:
- Be fair but rigorous
- Assess understanding, not just memorization
- Consider partial credit for partial understanding
- Provide constructive, actionable feedback
- Focus on key concepts and critical thinking

RESPONSE FORMAT (JSON):
{
  "score": 0-100,
  "isCorrect": boolean (score >= 70),
  "feedback": "Overall assessment of the essay",
  "keyPoints": {
    "captured": ["Point 1 the student understood well", "Point 2..."],
    "missed": ["Key concept they missed", "Another missed point..."]
  },
  "rubricBreakdown": [
    {
      "criterion": "Criterion name from rubric",
      "score": points_earned,
      "maxScore": max_points,
      "feedback": "Specific feedback for this criterion"
    }
  ]
}

Return ONLY valid JSON, no markdown or explanations.`;
    } else {
        return `You are an expert educational assessor specializing in short-answer grading.

Your task is to grade student answers fairly using semantic understanding, not exact word matching.

GRADING PRINCIPLES:
- Focus on conceptual understanding, not exact wording
- Accept equivalent explanations and terminology
- Consider partial credit for partial understanding
- Be generous with technical accuracy
- Penalize only for genuine misunderstandings

RESPONSE FORMAT (JSON):
{
  "score": 0-100,
  "isCorrect": boolean (score >= 70),
  "feedback": "Clear explanation of what was right/wrong",
  "keyPoints": {
    "captured": ["Concept they got right", "Another correct point..."],
    "missed": ["Key concept they missed", "Another missed point..."]
  }
}

Return ONLY valid JSON, no markdown or explanations.`;
    }
}

function buildUserPrompt(request: GradingRequest): string {
    let prompt = `QUESTION:
${request.question}

MODEL ANSWER:
${request.modelAnswer}

STUDENT ANSWER:
${request.studentAnswer}
`;

    if (request.context?.topic) {
        prompt += `\nTOPIC: ${request.context.topic}`;
    }

    if (request.context?.difficulty) {
        prompt += `\nDIFFICULTY: ${request.context.difficulty}`;
    }

    if (request.rubric) {
        prompt += `\n\nGRADING RUBRIC:
${request.rubric}

Please break down the score according to each rubric criterion.`;
    }

    prompt += `\n\nGrade this answer and return your assessment as JSON.`;

    return prompt;
}
