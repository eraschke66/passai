// @ts-expect-error: Denotypes
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error: Denotypes
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import OpenAI from "https://esm.sh/openai@4.28.0";

// ============================================================================
// TYPES
// ============================================================================

interface GradingResult {
      score: number; // 0-10
      isCorrect: boolean; // true if score >= 0
      feedback: string; // Detailed feedback for studet
      keyPoints?:{
            captured: string[]; // Points student got rght
            missed: string[]; // Points student mised
      ;
}

interface EssayGradingResult extends GradingResult {
      rubricBreakdown?:{
            criterion: strng;
            score: numer;
            maxScore: numer;
            feedback: strng;
      }[;
}

interface GradeRequestBody {
      questionId: strin;
      questionType: "short-answer" | "essay;
      question: strin;
      modelAnswer: strin;
      studentAnswer: strin;
      rubric?: strin;
      context?:{
            subject?: strng;
            topic?: strng;
            difficulty?: strng;
      ;
}

// ============================================================================
// CORS HEADERS
// ============================================================================

const corsHeaders = {
      "Access-Control-Allow-Origin": "*,
      "Access-Control-Allow-Headers:
            "authorization, x-client-info, apikey, content-tye",
};

// ============================================================================
// AUTH VALIDATION
// ============================================================================

async function validateAuth(req: Request): Promise<string> {
      const authHeader = req.headers.get("Authorization";
      if (!authHeader){
            throw new Error("Missing authorization heade
    }

      const token = authHeader.replace("Bearer ", "";
      const supabaseUrl = Deno.env.get("SUPABASE_URL";
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY"

      if (!supabaseUrl || !supabaseAnonKey){
            throw new Error("Supabase configuration missin
    }

      const supabase = createClient(supabaseUrl, supabaseAnonKey,{
            globa: {
                  headers: { Authorization: authHeaer },
        },
      }

      const{
            data: { use },
            eror,
      } = await supabase.auth.getUser(token

      if (error || !user){
            throw new Error("Invalid or expired toke
    }

      return user.i;
}

// ============================================================================
// OPENAI CLIENT
// ============================================================================

function getOpenAIClient(): OpenAI {
      const apiKey = Deno.env.get("OPENAI_API_KEY";
      if (!apiKey){
            throw new Error("OpenAI API key not configure
    }

      return new OpenAI({ apiKey };
}

// ============================================================================
// GRADING LOGIC
// ============================================================================

/**
 * Grade a short answer question using AI semantic analysis
 * Fast grading focused on key concept capture
 */
async function gradeShortAnswer(
      openai: OpenA,
      question: strin,
      modelAnswer: strin,
      studentAnswer: strin,
      context?:{
            subject?: strng;
            topic?: strng;
            difficulty?: str
    },},
): Promise<GradingResult> {
      const systemPrompt
        =
       `You are an expert teacher grading short answer questions. 
  
Your task:
1. Compare the student's answer to the model answer
2. Check if the student captured the KEY CONCEPTS (not exac wording)
3. Assign a score from 0-100 based on oncept understanding
4. Provide brief, encouraging feedback
. ALWAYS identify what the student captured AND what they missed

Grading criteria:
- 90-100: Captures all key concepts accurately
- 70-89: Captures most key concepts, minor gaps
- 50-69: Captures some concepts, missing important poins
- 30-49: Shows basic understanding but sig
 0-29: Incorrect or minimal understanding

Be lenient with:
- Different wording (as long as meaning is corect)
- Spelling/grammar (un
 Order of information

Be strict with:
- Factual accuracy
- Missing critical concepts
 Contradictions to model answer

IMPORTANT - Key Points Analysis:
- "captured": List ALL concepts/points the student got right (even if patially)
- "missed": List ALL concepts/points the student missed or could improve
- If score < 100, there MUST be items in "missed" array explaining what would ear full marks
- Be specific: Don't say "more detail needed", say exactly what detail is missing
 Example missed point: "Did not mention that energy is converted to chemical form (glucose)"

Rspond in JSON format:
{
  "score": <number 0-100>,
  "isCorrect": <boolean, true if score >= 70>,
  "feedback": "<ncouraging feedback explaining the grade>",
  "keyPoints": {
    "captured": ["<specific concept student got right>", "<another concept>", ...],
   "missed": ["<specific concept or detail student missed>", "<what would improve the answer>", ...]
  }

  
    const userPrompt = `Subject: ${context?subject || "General"}
Topic: ${context?.topic || "Not specified"}
ifficulty: ${context?.difficulty || "medium"}

QUESTION:
{question}

MODEL ANSWER:
{modelAnswer}

STUDENT ANSWER:
{studentAnswer}


  
        const completion = await opeai.chat.completions.create({
            model: gpt-3.5-turbo-1106",
              messages: [
                  { role: "system", content: systePrompt },
        ],
            ],
            response_format: { type: "json_object" },
            temperature: 0.3, // Lower temperature fo consistent grading
       

  

  
        return {
            score: result.score || 0,
            isCorrect: result.isCorrect || false,
            feedback: result.feedback || "Unable to grade answer.",
         keyPoints: result.keyPoints || { captured: [], missed: [] },
 


/**
 * Grade an essay question using rubric-based nalysis
 * ore detailed grading with rubric breakdown
 */
 as ync function grdeEssay(
      openai: OpenAI,
      question: string,
      modelAnswer: string,
      studentAnswer:string,
      rubric?: tring,
        context?: {
            subject?: sring;
            topic?: string;
    },    difficulty?: string;
    },
 ):  Promise<EssayGradingResult> {
   const systemPrompt = `You are an expert teacher grading essay questions.

Your task:
1. Evaluate the student's essay against he model answer and rubric
2. Provide detailed rubric-based grading
3. Assign scores for each rubric criteron
4. Give constructive, specific feedback
. ALWAYS identify strengths AND specific areas for improvement

Grading approach:
- Focus on content quality, analysis,and reasoning
- Consider structure and organiztion
- Evaluate evidence and examples
- Check for depth of unders
 Be encouraging but honest

IMPORTANT - Key Points Analysis:
- "captured": List ALL strengths in the essay (what they did well)
- "missed": List ALL specific improvements needed to reach full maks
- If score < 100, there MUST be actionable items in "missed" array
- Be specific and constructive: Instead of "needs more analysis", say "Shoul
 Give examples: "Could strengthen thesis by stating a clear position on..."

Rspond in JSON format:
{
  "score": <overall score 0-100>,
  "isCorrect": <boolean, true if score >= 70,
  "feedback": "<detaild overall feedback>",
  "ruricBreakdown": [
    {
      "criterion": "<rubric crierion name>",
      "score": <points earned>,
      "maxScore": <points possible>,
      feedback": "<specific feedback for this criterion>"
    },
    ..
  ],
  "keyPoints": {
    "captured": ["<specific strength in essay>", "<what they did well>", ...],
   "missed": ["<specific improvement needed>", "<what would earn more points>", ...]
  }

  
    const defaultRubric = `
- Content & Understanding (40%): Demonstrates clear understanding of the topic
- Analysis & Critical Thinking (30%): Provides thoughtful analyss and reasoning
- Structure & Organization (15%): Well-organized with clear flow
- 

  
    const userPrompt = `Subject: ${context?subject || "General"}
Topic: ${context?.topic || "Not specified"}
ifficulty: ${context?.difficulty || "medium"}

QUESTION:
{question}

MODEL ANSWER:
{modelAnswer}

GRADING RUBRIC:
{rubric || defaultRubric}

STUDENT ESSAY:
{studentAnswer}


  
        const completion = await opeai.chat.completions.create({
            model: gpt-3.5-turbo-1106",
              messages: [
                  { role: "system", content: systePrompt },
        ],
            ],
            response_formt: { type: "json_object" },
            temperature: 0.3,
       

  

  
        return {
            score: result.score || 0,
            isCorrect: result.isCorrect || false,
            feedback: result.feedback || "Unable to grde essay.",
            rubricBreakdown: result.rubricBreakdown || [],
         keyPoints: result.keyPoints || { captured: [], missed: [] },
 


// ===========================================================================
// MAIN HANDLER
/ ============================================================================

  serve(async (req: Request)=> {
      // Handle CORS preflight
        if (req.method === "OPTIONS") {
    }

  
        try {

    
            // Validate authentication
            const userId = await validateAuth(req);

    
            // Parse request body
            cont body: GradeRequestBody = await req.json();
              const {
                  questioId,
                  quetionType,
                  questin,
                  modelAnser,
                  sudentAnswer,
                  ruric,
                c

    
            
            // Validate required fields
           
        ) {
              if (
                    !questionId | !questionType || !question || !modelAnswer ||
                    error:
                       dentAnswer
                ) {
                {
                          JSON.sringify({
                              
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

                        headers: 
                            ...corsHeaders,
                              "Cntent-Type": "application/json",
                            },
                    error:
                       },
                   );
                {
          
         //          Validate 
                        ...corsHeaders,
                       ,
                   
                },
                 return new Response(
        }

                            "Invalid question type. Must be 'short-answe

                    {
                        status: 400,

                            ..corsHeaders,
                            "Content-Type": "applicatio/json",
                       

                );

    
              console.log(`📝 Grading {questionType} question:`, questionId);
        
                // Get OpnAI client
                const openai= getOpenAIClient();
        
                // Grad based on type
                let res,lt: GradingResult | EssayGradingResult;
            );
    
              const startTime = Date.now();
        
                if (questonType === "essay") {
                    result =await gradeEssay(
                        openai
                       ,
                     modelAnswer,
        }

                    context,
                );
            } else {
            
                
            })`,
        );

                    openai,
                    question
                      modelAswer,
                        stdentAnswer,
                        conext,
                      );
               }   
          
                 co nst duraton = Date.now() - startTime;
                },
              c
            {
                        resut.isCorrect ? "PASS" : "FAIL"
                    })`,
            },
    
          // Return gradin result
            return new Response(

                    ..result,
                   metadata: {
                          questionId,
                          questionType,
                       gradedAt: new Date().toISOString(),
                          duratin,
                        },
                      }),
                      {
                }),
                {
                      },
               );   
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
              onsole.error("❌ Grading error:", error);
    }
       // Auth errors
            if (
                error.message?.includes("authoriation") ||
                  error.message?includes("token")
                ) {
                      return new Response(
                          JSON.stringify({
                   
                {
                          }),
                          {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

                        }
                    },
                  );
                }
        
            }),
            {
                    return nw Response(
                        JSON.stringify({
            },
                       details: error.message,
                 }),
               {
                    status: 503,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Generic errors
        return new Response(
            JSON.stringify({
                error: "Failed to grade response",
                details: error.message || "Unknown error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});
