import { openai } from "@/lib/ai/openai";
import type { Subject } from "@/features/subjects/types";

type GeneratedQuestionsType = {
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  options: string[] | null; // null for short-answer and essay
  correct_answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  concept: string; // Specific concept being tested (for BKT tracking)
  points: number;
  source_snippet: string;
};

export const generateQuizQuestions = async (
  combinedText: string,
  settings: {
    questionCount: number;
    subjectName: string;
    difficulty: "easy" | "medium" | "hard" | "adaptive";
    questionTypes: {
      multipleChoice: boolean;
      trueFalse: boolean;
      shortAnswer: boolean;
      matching: boolean;
    };
    cognitiveMix: {
      recall: number;
      understanding: number;
      application: number;
    };
    focusAreas: string;
  },
  subject?: Subject // Optional subject for teacher layer customization
): Promise<GeneratedQuestionsType[]> => {
  // Truncate material content if too long (keep under ~6000 tokens for safety)
  const maxContentLength = 8000;
  const truncatedContent =
    combinedText.length > maxContentLength
      ? combinedText.substring(0, maxContentLength) +
        "\n\n[Content truncated...]"
      : combinedText;

  // Extract teacher layer data
  const examBoard = subject?.exam_board || null;
  const questionStyle = subject?.question_style || "multiple_choice";
  const teacherEmphasis = subject?.teacher_emphasis || null;
  const gradingRubric = subject?.grading_rubric || null;

  // Build curriculum-aligned system prompt
  const systemPrompt = buildCurriculumAlignedPrompt(
    settings.subjectName,
    examBoard,
    questionStyle,
    teacherEmphasis,
    gradingRubric
  );

  // Build user prompt
  const userPrompt = buildUserPrompt(truncatedContent, settings, examBoard);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content;
  const jsonResponse = JSON.parse(responseText || "{}");

  console.log("OpenAI Response:", jsonResponse);

  return jsonResponse.questions || [];
};

// =============================================
// Helper: Build Curriculum-Aligned System Prompt
// =============================================

function buildCurriculumAlignedPrompt(
  subjectName: string,
  examBoard: string | null,
  questionStyle: string,
  teacherEmphasis: string | null,
  gradingRubric: string | null
): string {
  let prompt = `You are an expert educational quiz generator.`;

  // Add exam board context
  if (examBoard && examBoard !== "Other") {
    prompt += ` You are specifically creating questions for the ${examBoard} ${subjectName} exam.`;
    prompt += getExamBoardGuidance(examBoard);
  } else {
    prompt += ` Your task is to create high-quality ${subjectName} quiz questions.`;
  }

  // Add standard requirements
  prompt += `

**CRITICAL REQUIREMENTS:**
1. You MUST respond with a valid JSON object containing a "questions" array
2. The response format MUST be: {"questions": [... array of question objects ...]}
3. NEVER return a single question object - ALWAYS return an array even if generating just one question
4. No additional text, explanations, or markdown formatting outside the JSON
5. Generate questions according to the specified question style/format
6. For multiple-choice: NEVER add letter prefixes (A., B., C., D.) to options - provide plain text only

**GENERATE QUESTIONS THAT:**
1. Test understanding, not just memorization
2. Are clear, concise, and unambiguous
3. Have accurate answers with helpful explanations
4. Match the requested difficulty level
5. Cover key concepts from the material
6. Each question MUST identify a SPECIFIC CONCEPT being tested (for knowledge tracking)

**CONCEPT IDENTIFICATION:**
- For each question, identify the SPECIFIC concept/topic being tested
- Concepts should be precise and granular (e.g., "Photosynthesis" not just "Biology")
- Examples: "Mitochondrial Function", "Pythagorean Theorem", "French Revolution Causes"
- This concept will be used to track student mastery over time

**QUESTION TYPES SUPPORTED:**
- multiple-choice: Exactly 4 plain text options with one correct answer (NO "A. ", "B. " prefixes)
- true-false: Statement with exactly 2 options: ["True", "False"]
- short-answer: Brief written response (1-3 sentences). Set options to null, provide model answer in correct_answer
- essay: Extended written response (3-5 paragraphs). Set options to null, provide model answer in correct_answer

**DIFFICULTY LEVELS:**
- easy: Basic recall and comprehension
- medium: Application and analysis
- hard: Synthesis and evaluation`;

  // Add teacher emphasis if provided
  if (teacherEmphasis) {
    prompt += `

**TEACHER FOCUS AREAS:**
The teacher emphasizes: "${teacherEmphasis}"
Prioritize questions that cover these topics and align with this focus.`;
  }

  // Add grading rubric if provided
  if (gradingRubric) {
    prompt += `

**GRADING EXPECTATIONS:**
Teacher's grading style: "${gradingRubric}"
Generate questions and answers that align with these grading criteria.
Ensure explanations demonstrate what the teacher looks for.`;
  }

  // Add question style guidance
  prompt += getQuestionStyleGuidance(questionStyle);

  return prompt;
}

// =============================================
// Helper: Get Exam Board-Specific Guidance
// =============================================

function getExamBoardGuidance(examBoard: string): string {
  const guidance: Record<string, string> = {
    "IB (International Baccalaureate)": `

**IB-SPECIFIC REQUIREMENTS:**
- Use IB command terms: Analyze, Evaluate, Discuss, Compare, Explain, Describe, Define, Outline
- Follow IB marking criteria focusing on:
  * Knowledge and Understanding
  * Application and Analysis
  * Synthesis and Evaluation
- Questions should reflect IB's emphasis on critical thinking and global contexts
- Use international examples and perspectives where relevant`,

    "AP (Advanced Placement)": `

**AP-SPECIFIC REQUIREMENTS:**
- Align with AP Course Framework for this subject
- Use AP-style question formats and terminology
- Focus on:
  * Content knowledge
  * Skills and practices specific to the discipline
  * Application of concepts to real-world scenarios
- Include both conceptual understanding and procedural skills`,

    "A-Level": `

**A-LEVEL SPECIFIC REQUIREMENTS:**
- Follow UK A-Level specification
- Use command words: Assess, Justify, Discuss, Evaluate, Analyze, Explain
- Questions should require:
  * Detailed knowledge and understanding
  * Critical analysis and evaluation
  * Extended reasoning
- Use UK-specific examples and contexts where appropriate`,

    GCSE: `

**GCSE-SPECIFIC REQUIREMENTS:**
- Align with GCSE specification for this subject
- Use tiered language appropriate for GCSE level
- Focus on:
  * Core knowledge and understanding
  * Application to familiar contexts
  * Clear, accessible language
- Command words: Describe, Explain, Compare, Evaluate`,

    IGCSE: `

**IGCSE-SPECIFIC REQUIREMENTS:**
- Follow Cambridge IGCSE syllabus
- Use international contexts and examples
- Balance between:
  * Factual recall
  * Understanding and application
  * Analysis and evaluation
- Clear, concise language suitable for international students`,

    "SAT Subject Tests": `

**SAT-SPECIFIC REQUIREMENTS:**
- Follow College Board SAT Subject Test format
- Focus on:
  * Content knowledge across full curriculum
  * Problem-solving skills
  * Time-efficient questions
- Questions should be answerable in 60-90 seconds`,
  };

  return guidance[examBoard] || "";
}

// =============================================
// Helper: Get Question Style Guidance
// =============================================

function getQuestionStyleGuidance(questionStyle: string): string {
  const styleGuidance: Record<string, string> = {
    multiple_choice: `

**QUESTION FORMAT:**
Generate ONLY multiple choice questions.
- Provide exactly 4 options per question
- Options should be plausible but only one correct
- Avoid "all of the above" or "none of the above"
- Options should be roughly equal length
- Randomize correct answer position`,

    short_answer: `

**QUESTION FORMAT:**
Generate short answer questions that require brief written responses (1-3 sentences).
- Set "type" to "short-answer"
- Set "options" to null (no multiple choice options)
- In "correct_answer", provide a comprehensive model answer
- Questions should test understanding, application, or analysis
- Ask clear, specific questions that have definitive answers
- Model answers should be 1-3 sentences long
- Examples: "What is photosynthesis?", "Explain Newton's First Law", "Define supply and demand"`,

    essay: `

**QUESTION FORMAT:**
Generate essay questions that require extended written responses (3-5 paragraphs).
- Set "type" to "essay"
- Set "options" to null (no multiple choice options)
- In "correct_answer", provide a comprehensive model answer (3-5 paragraphs)
- Questions should test analysis, synthesis, evaluation, and critical thinking
- Use command words: Discuss, Analyze, Evaluate, Compare, Assess, Justify
- Model answers should demonstrate expected depth and structure
- Include key points that should be covered
- Examples: "Discuss the causes of World War I", "Evaluate the effectiveness of...", "Compare and contrast..."`,

    mixed: `

**QUESTION FORMAT:**
Generate a mix of question types:
- 70% multiple choice (4 options each)
- 30% true/false (2 options each)
- Vary difficulty across question types
- Ensure variety in cognitive levels tested`,
  };

  return styleGuidance[questionStyle] || styleGuidance.mixed;
}

// =============================================
// Helper: Build User Prompt
// =============================================

function buildUserPrompt(
  truncatedContent: string,
  settings: {
    questionCount: number;
    subjectName: string;
    difficulty: string;
  },
  examBoard: string | null
): string {
  let prompt = `Generate ${settings.questionCount} ${
    settings.difficulty
  } difficulty quiz questions from the following study material.

${settings.subjectName ? `Subject: ${settings.subjectName}` : ""}`;

  // Add exam board reminder
  if (examBoard && examBoard !== "Other") {
    prompt += `
Exam Board: ${examBoard}`;
  }

  prompt += `

Study Material:
${truncatedContent}

Response format - you MUST use this EXACT structure:
{
  "questions": [
    {
      "question": "The question text",
      "type": "multiple-choice" | "true-false" | "short-answer" | "essay",
      "options": ["First option", "Second option", "Third option", "Fourth option"] for multiple-choice, 4 options, NO "A. ", "B. " prefixes or ["True", "False"] for true-false,
      "correct_answer": "0" | "1" | "2" | "3" for MCQ or "true" | "false" for true-false. Give the index of the correct answer in the options array for multiple-choice. For true-false, use "true" or "false",
      "explanation": "Why this answer is correct and what concept it tests",
      "difficulty": "easy" | "medium" | "hard",
      "topic": "General topic area",
      "concept": "Specific concept name", // REQUIRED: Specific, granular concept being tested
      "points": 1-5, // Points based on difficulty: easy=1, medium=2-3, hard=4-5
      "source_snippet": "excerpt from the material that relates to this question"
    }
    // ... ${settings.questionCount} total questions
  ]
}

CRITICAL: Every question MUST include a "concept" field with a specific, meaningful concept name.

Question type distribution:
- 40% multiple-choice (4 options each)
- 20% true-false (2 options each)
- 30% short-answer (AI graded)
- 10% essay (AI graded)

CRITICAL: Your response MUST be a JSON object with a "questions" array containing ${settings.questionCount} question objects. DO NOT return anything else.`;

  return prompt;
}
