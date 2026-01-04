/**
 * Prompt building utilities for curriculum-aligned quiz generation
 */

import type { QuizSettings } from "./database.ts";

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
- Model answers should be 1-3 sentences long`,

    essay: `

**QUESTION FORMAT:**
Generate essay questions that require extended written responses (3-5 paragraphs).
- Set "type" to "essay"
- Set "options" to null (no multiple choice options)
- In "correct_answer", provide a comprehensive model answer (3-5 paragraphs)
- Questions should test analysis, synthesis, evaluation, and critical thinking
- Use command words: Discuss, Analyze, Evaluate, Compare, Assess, Justify`,

    fill_in_blank: `

**QUESTION FORMAT:**
Generate fill-in-the-blank (cloze) questions where students complete a sentence.
- Set "type" to "fill-in-blank"
- Set "options" to null (no multiple choice options)
- Use underscores _____ to indicate the blank in the question text
- In "correct_answer", provide the exact word(s) that fill the blank
- Questions should test recall and understanding of key terms
- The blank should be for a meaningful concept, not trivial words
- Example: "The process of _____ converts light energy into chemical energy." (answer: "photosynthesis")`,

    mixed: `

**QUESTION FORMAT:**
Generate a diverse mix of question types for comprehensive assessment:
- 40% multiple choice (4 options each)
- 20% true/false (2 options each)
- 20% short-answer (AI graded, 1-3 sentences)
- 10% fill-in-blank (key terms and concepts)
- 10% essay (AI graded, extended response)
- Vary difficulty across question types
- Ensure variety in cognitive levels tested (Bloom's Taxonomy)
- Balance between recall, understanding, application, and analysis`,
  };

  return styleGuidance[questionStyle] || styleGuidance.mixed;
}

export function buildCurriculumAlignedPrompt(
  subjectName: string,
  examBoard: string | null,
  questionStyle: string,
  teacherEmphasis: string | null,
  gradingRubric: string | null,
): string {
  let prompt = `You are an expert educational quiz generator.`;

  if (examBoard && examBoard !== "Other") {
    prompt +=
      ` You are specifically creating questions for the ${examBoard} ${subjectName} exam.`;
    prompt += getExamBoardGuidance(examBoard);
  } else {
    prompt +=
      ` Your task is to create high-quality ${subjectName} quiz questions.`;
  }

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
7. Include a helpful HINT that guides without revealing the answer
8. Include a Bloom's Taxonomy level (remember, understand, apply, analyze, evaluate, create)

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
- fill-in-blank: Cloze deletion with _____ indicating blank. Set options to null, provide exact answer in correct_answer

**DIFFICULTY LEVELS:**
- easy: Basic recall and comprehension (Bloom's: remember, understand)
- medium: Application and analysis (Bloom's: apply, analyze)
- hard: Synthesis and evaluation (Bloom's: evaluate, create)

**BLOOM'S TAXONOMY LEVELS:**
- remember: Recall facts, terms, basic concepts
- understand: Explain ideas or concepts
- apply: Use information in new situations
- analyze: Draw connections among ideas
- evaluate: Justify a decision or course of action
- create: Produce new or original work`;

  if (teacherEmphasis) {
    prompt += `

**TEACHER FOCUS AREAS:**
The teacher emphasizes: "${teacherEmphasis}"
Prioritize questions that cover these topics and align with this focus.`;
  }

  if (gradingRubric) {
    prompt += `

**GRADING EXPECTATIONS:**
Teacher's grading style: "${gradingRubric}"
Generate questions and answers that align with these grading criteria.
Ensure explanations demonstrate what the teacher looks for.`;
  }

  prompt += getQuestionStyleGuidance(questionStyle);

  return prompt;
}

export function buildUserPrompt(
  materialContent: string,
  settings: QuizSettings,
  examBoard: string | null,
): string {
  let prompt =
    `Generate ${settings.questionCount} ${settings.difficulty} difficulty quiz questions from the following study material.

${settings.subjectName ? `Subject: ${settings.subjectName}` : ""}`;

  if (examBoard && examBoard !== "Other") {
    prompt += `
Exam Board: ${examBoard}`;
  }

  if (settings.focusAreas) {
    prompt += `
Focus Areas: ${settings.focusAreas}`;
  }

  prompt += `

Study Material:
${materialContent}

Response format - you MUST use this EXACT structure:
{
  "questions": [
    {
      "question": "The question text (use _____ for fill-in-blank)",
      "type": "multiple-choice" | "true-false" | "short-answer" | "essay" | "fill-in-blank",
      "options": ["First option", "Second option", "Third option", "Fourth option"] for multiple-choice (4 options, NO "A. ", "B. " prefixes) or ["True", "False"] for true-false or null for short-answer/essay/fill-in-blank,
      "correct_answer": "0" | "1" | "2" | "3" for MCQ (index) or "true" | "false" for true-false or model answer text for short-answer/essay or exact word(s) for fill-in-blank,
      "explanation": "Why this answer is correct and what concept it tests",
      "difficulty": "easy" | "medium" | "hard",
      "bloom_level": "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create",
      "hint": "A helpful hint that guides thinking without revealing the answer",
      "topic": "General topic area",
      "concept": "Specific concept name (required for mastery tracking)",
      "points": 1-5,
      "source_snippet": "excerpt from the material that relates to this question"
    }
  ]
}

CRITICAL: Every question MUST include:
- "concept" field with a specific, meaningful concept name for mastery tracking
- "bloom_level" field indicating cognitive level (remember, understand, apply, analyze, evaluate, create)
- "hint" field with a helpful hint that doesn't give away the answer
`;

  // Build question type distribution based on user selection
  const enabledTypes: string[] = [];
  if (settings.questionTypes.multipleChoice) {
    enabledTypes.push("multiple-choice");
  }
  if (settings.questionTypes.trueFalse) enabledTypes.push("true-false");
  if (settings.questionTypes.shortAnswer) enabledTypes.push("short-answer");
  if (settings.questionTypes.essay) enabledTypes.push("essay");
  if (settings.questionTypes.fillInBlank) enabledTypes.push("fill-in-blank");

  // If no types selected, default to mixed
  if (enabledTypes.length === 0) {
    prompt += `
Question type distribution:
- 40% multiple-choice (4 options each)
- 20% true-false (2 options each)
- 20% short-answer (AI graded, 1-3 sentences)
- 10% fill-in-blank (key terms)
- 10% essay (AI graded, extended response)
`;
  } else if (enabledTypes.length === 1) {
    // Only one type selected, use 100% of that type
    prompt += `
Question types: Generate ONLY ${enabledTypes[0]} questions.
`;
  } else {
    // Multiple types selected, distribute evenly
    const percentage = Math.floor(100 / enabledTypes.length);
    prompt += `
Question type distribution (distribute ${settings.questionCount} questions across these types):
`;
    enabledTypes.forEach((type) => {
      let description = "";
      switch (type) {
        case "multiple-choice":
          description = "(4 options each)";
          break;
        case "true-false":
          description = "(2 options each)";
          break;
        case "short-answer":
          description = "(AI graded, 1-3 sentences)";
          break;
        case "essay":
          description = "(AI graded, extended response)";
          break;
        case "fill-in-blank":
          description = "(key terms with _____)";
          break;
      }
      prompt += `- ~${percentage}% ${type} ${description}\n`;
    });
  }

  prompt += `
CRITICAL: Your response MUST be a JSON object with a "questions" array containing ${settings.questionCount} question objects. DO NOT return anything else.`;

  return prompt;
}
