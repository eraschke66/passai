# Grade Response Edge Function

**Location:** `supabase/functions/grade-response/`  
**Created:** January 3, 2026  
**Purpose:** AI-powered grading for short-answer and essay questions

---

## 📁 File Structure

```
grade-response/
├── index.ts       (203 lines) - Main handler with auth & validation
├── anthropic.ts   (210 lines) - Claude API integration for grading
├── auth.ts        (49 lines)  - JWT validation & CORS headers
└── grading.ts     (106 lines) - Database operations
```

---

## 🚀 Deployment Instructions

### 1. Copy to Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project → **Edge Functions**
2. Click **Create Function** → Name it `grade-response`
3. Copy each file into the editor:
   - `index.ts` → Main handler
   - `auth.ts` → Auth utilities
   - `anthropic.ts` → AI grading
   - `grading.ts` → Database queries

### 2. Set Environment Variables

In **Supabase Dashboard** → **Project Settings** → **Edge Functions** → **Secrets**:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Deploy

Click **Deploy** in the dashboard.

---

## 📡 API Endpoint

**POST** `https://your-project.supabase.co/functions/v1/grade-response`

### Headers
```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

### Request Body
```json
{
  "questionId": "uuid",
  "questionType": "short-answer" | "essay",
  "question": "What is photosynthesis?",
  "modelAnswer": "The process by which plants convert light energy...",
  "studentAnswer": "Plants use sunlight to make food...",
  "rubric": "Optional grading rubric for essays",
  "context": {
    "topic": "Biology - Cellular Processes",
    "difficulty": "intermediate"
  }
}
```

### Response
```json
{
  "score": 85,
  "isCorrect": true,
  "feedback": "Good understanding of the core concept...",
  "keyPoints": {
    "captured": ["Correct identification of light energy", "Mentioned food production"],
    "missed": ["Didn't mention chlorophyll", "Missing glucose production"]
  },
  "rubricBreakdown": [
    {
      "criterion": "Conceptual Understanding",
      "score": 8,
      "maxScore": 10,
      "feedback": "Shows strong grasp of basic process"
    }
  ],
  "usage": {
    "input_tokens": 245,
    "output_tokens": 128
  }
}
```

---

## 🔧 How It Works

### 1. Authentication (`auth.ts`)
- Validates JWT token from `Authorization` header
- Creates authenticated Supabase client
- Returns user ID for RLS filtering

### 2. Question Fetching (`grading.ts`)
- Fetches question from database using `questionId`
- Validates user has access (via quiz ownership)
- Retrieves subject grading rubric if available

### 3. AI Grading (`anthropic.ts`)
- Uses **Claude 3.5 Haiku** for fast, accurate grading
- Lower temperature (0.3) for consistent grading
- Semantic understanding (not keyword matching)
- Returns structured feedback with key points

### 4. Response Formatting (`index.ts`)
- Returns grading result as JSON
- Includes usage statistics for monitoring
- Handles errors with appropriate HTTP status codes

---

## ✅ Features

### For Short-Answer Questions:
- Semantic understanding (accepts equivalent answers)
- Identifies captured vs. missed concepts
- Clear, constructive feedback
- Passing threshold: 70/100

### For Essay Questions:
- Rubric-based grading (uses subject's rubric if available)
- Criterion-by-criterion breakdown
- Holistic assessment
- Detailed feedback per criterion

### Security:
- JWT authentication required
- RLS validation (user can only grade their own quizzes)
- CORS headers configured
- Error messages don't leak sensitive data

---

## 🧪 Testing in Dashboard

### Test Short-Answer:
```json
{
  "questionId": "test-question-uuid",
  "questionType": "short-answer",
  "question": "What is the capital of France?",
  "modelAnswer": "Paris",
  "studentAnswer": "The capital is Paris"
}
```

Expected: `score: 100, isCorrect: true`

### Test Essay:
```json
{
  "questionId": "test-question-uuid",
  "questionType": "essay",
  "question": "Explain the causes of World War I",
  "modelAnswer": "The causes included militarism, alliances, imperialism, and nationalism...",
  "studentAnswer": "WW1 started because of complex alliances and militarism...",
  "rubric": "30% - Identifies major causes\n40% - Explains interconnections\n30% - Historical accuracy"
}
```

Expected: Rubric breakdown with scores per criterion

---

## 🔗 Frontend Integration

The function is already called from:
- `src/features/quizzes/utils/answerValidation.ts` (line 119)

```typescript
const { data: gradingResult, error: gradingError } = await supabase
  .functions.invoke("grade-response", {
    body: {
      questionId: question.id,
      questionType: questionType === "essay" ? "essay" : "short-answer",
      question: question.question,
      modelAnswer: question.correct_answer,
      studentAnswer: userAnswer,
      rubric: rubric,
      context: {
        topic: question.topic || undefined,
        difficulty: question.difficulty || undefined,
      },
    },
  });
```

**Status:** ✅ Frontend ready, just needs backend deployed!

---

## 📊 Cost Monitoring

Claude 3.5 Haiku pricing (as of Jan 2026):
- Input: ~$0.25 per 1M tokens
- Output: ~$1.25 per 1M tokens

Average grading:
- Short-answer: ~300 input + 150 output tokens = $0.0003
- Essay: ~800 input + 400 output tokens = $0.0007

For 1000 questions/month: ~$0.50 in AI costs

---

## 🐛 Troubleshooting

### "ANTHROPIC_API_KEY not configured"
→ Add the secret in Supabase Dashboard

### "Question not found"
→ Check `questionId` is valid and user has access

### "Invalid response from Claude"
→ Claude returned non-JSON, check logs for raw response

### "Authentication required"
→ Frontend not sending JWT token in Authorization header

---

## 🎯 Next Steps

After deployment:
1. Test with real questions from UI
2. Monitor Claude API usage in logs
3. Clean up deprecated frontend grading code
4. Remove `VITE_OPENAI_API_KEY` from frontend

---

**Status:** ✅ Ready for deployment  
**Dependencies:** Anthropic API key  
**Frontend Status:** Already integrated, waiting for backend
