# Supabase Edge Functions
**PassAI Study Platform - Secure Backend Services**

---

## 📁 Directory Structure

```
supabase/functions/
├── _shared/              # Shared utilities (import from any function)
│   ├── auth.ts          # JWT validation & access control
│   ├── cors.ts          # CORS headers configuration
│   ├── errors.ts        # Error handling & response utilities
│   ├── openai.ts        # Server-side OpenAI client (secure!)
│   └── types.ts         # TypeScript type definitions
├── test/                # Test function (deployment verification)
│   └── index.ts
├── generate-quiz/       # Quiz generation from study materials
│   └── index.ts         # TODO: Implement in Task #2
├── grade-response/      # AI grading for student answers
│   └── index.ts         # TODO: Implement in Task #3
└── README.md           # This file
```

---

## 🎯 Purpose

These Edge Functions move sensitive operations (OpenAI API calls) from the frontend to a secure backend environment, eliminating the critical security vulnerability of exposed API keys.

**Before:** Frontend calls OpenAI directly with `VITE_OPENAI_API_KEY` + `dangerouslyAllowBrowser: true` ❌  
**After:** Frontend calls Edge Functions → Edge Functions call OpenAI with secure server-side key ✅

---

## 📋 Functions Overview

### **test** 🟡 Ready to Deploy
**Purpose:** Verify deployment process and environment configuration  
**Endpoint:** `POST /functions/v1/test`  
**Auth:** Optional (for testing)  

**Request:**
```json
{
  "name": "PassAI"
}
```

**Response:**
```json
{
  "message": "Hello PassAI!",
  "timestamp": "2025-12-14T...",
  "auth": { "status": "authenticated", "userId": "..." },
  "environment": {
    "supabase_url": true,
    "supabase_anon_key": true,
    "openai_api_key": true
  }
}
```

---

### **generate-quiz** 🔴 Not Implemented Yet
**Purpose:** Generate quiz questions from study materials using OpenAI  
**Endpoint:** `POST /functions/v1/generate-quiz`  
**Auth:** Required (JWT token)  

**Request:**
```json
{
  "subjectId": "uuid",
  "materialIds": ["uuid1", "uuid2"],
  "settings": {
    "questionCount": 10,
    "difficulty": "medium",
    "questionTypes": { "multipleChoice": true, "shortAnswer": true },
    "cognitiveMix": { "recall": 30, "understanding": 40, "application": 30 },
    "focusAreas": "Chapters 3-5"
  }
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "...",
      "type": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "...",
      "difficulty": "medium",
      "topic": "Cell Biology",
      "concept": "Mitochondrial Function",
      "points": 1,
      "source_snippet": "..."
    }
  ],
  "usage": { "prompt_tokens": 1234, "completion_tokens": 567 }
}
```

**Implementation Status:** Phase 2, Task #2 (Next up!)

---

### **grade-response** 🔴 Not Implemented Yet
**Purpose:** Grade student answers using AI semantic analysis  
**Endpoint:** `POST /functions/v1/grade-response`  
**Auth:** Required (JWT token)  

**Request:**
```json
{
  "questionType": "short-answer",
  "question": "Explain photosynthesis",
  "modelAnswer": "Photosynthesis is the process by which plants...",
  "studentAnswer": "Plants use sunlight to make food using chlorophyll...",
  "context": {
    "subject": "Biology",
    "topic": "Cell Biology",
    "difficulty": "medium"
  }
}
```

**Response:**
```json
{
  "score": 85,
  "isCorrect": true,
  "feedback": "Good understanding! You captured the key concepts...",
  "keyPoints": {
    "captured": ["Mentioned sunlight", "Explained energy conversion"],
    "missed": ["Could specify CO2 and H2O as reactants"]
  }
}
```

**Implementation Status:** Phase 3, Task #3

---

## 🔧 Shared Utilities

All functions can import from `_shared/`:

### **auth.ts**
```typescript
import { validateAuth } from '../_shared/auth.ts'

const { user, supabaseClient } = await validateAuth(req)
// Now you have authenticated user and Supabase client
```

### **cors.ts**
```typescript
import { corsHeaders } from '../_shared/cors.ts'

if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders })
}
```

### **errors.ts**
```typescript
import { createErrorResponse, createSuccessResponse, ValidationError } from '../_shared/errors.ts'

// In your function:
if (!body.subjectId) {
  throw new ValidationError('subjectId is required')
}

// Automatically handled:
return createSuccessResponse({ data: result })
```

### **openai.ts**
```typescript
import { getOpenAIClient, createChatCompletion } from '../_shared/openai.ts'

const completion = await createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello!' }]
})
```

### **types.ts**
```typescript
import { QuizGenerationRequest, GradingRequest } from '../_shared/types.ts'

// Type-safe request handling
const body: QuizGenerationRequest = await req.json()
```

---

## 🚀 Deployment

**Method:** Manual deployment via Supabase Dashboard  
**Why:** No local Supabase CLI setup for this project

### Steps:
1. Navigate to Supabase Dashboard → Edge Functions
2. Click "New Function" or select existing function
3. Copy/paste function code from this directory
4. Click "Deploy"
5. Test using dashboard test interface or from frontend

**See:** `work_md/EDGE_FUNCTIONS_DEPLOYMENT_GUIDE.md` for detailed instructions

---

## 🔐 Security

### Environment Variables (Secrets)
- `OPENAI_API_KEY` - OpenAI API key (configured in Supabase dashboard)
- `SUPABASE_URL` - Auto-provided by Supabase
- `SUPABASE_ANON_KEY` - Auto-provided by Supabase

### Authentication
- All functions validate JWT tokens from `Authorization` header
- Functions check user has access to requested resources (subjects, materials)
- Database RLS policies provide additional security layer

### Best Practices
- ✅ Never expose API keys in frontend
- ✅ Validate all inputs before processing
- ✅ Check user ownership of resources
- ✅ Use TypeScript for type safety
- ✅ Log errors for debugging (but not sensitive data)
- ✅ Return user-friendly error messages

---

## 📊 Development Status

| Phase | Tasks | Status | Progress |
|-------|-------|--------|----------|
| **Phase 1: Infrastructure** | Setup shared utilities | ✅ Complete | 100% |
| **Phase 2: Quiz Generation** | Implement generate-quiz | 🔄 In Progress | 0% |
| **Phase 3: AI Grading** | Implement grade-response | 🔴 Not Started | 0% |
| **Phase 4: Cleanup** | Remove frontend OpenAI | 🔴 Not Started | 0% |

**Overall Progress:** 1 / 12 tasks complete (8%)

---

## 📖 Documentation

- **Migration Plan:** `work_md/OPENAI_EDGE_FUNCTIONS_MIGRATION.md`
- **Deployment Guide:** `work_md/EDGE_FUNCTIONS_DEPLOYMENT_GUIDE.md`
- **Sprint Tracking:** `CURRENT_SPRINT.md`
- **Progress Log:** `PROGRESS_LOG.md`

---

## 🐛 Debugging

### View Logs
- Supabase Dashboard → Edge Functions → Select function → Logs tab

### Common Issues
1. **"OPENAI_API_KEY not configured"**
   - Solution: Add secret in Supabase dashboard

2. **"Invalid or expired token"**
   - Solution: Check JWT token is being passed correctly

3. **CORS errors**
   - Solution: Ensure function includes CORS headers (check `_shared/cors.ts`)

4. **Import errors**
   - Solution: Use relative paths for `_shared/` imports: `'../_shared/auth.ts'`

---

## 💡 Next Steps

1. **Deploy test function** - Verify everything works
2. **Implement generate-quiz** - Port quiz generation logic
3. **Implement grade-response** - Port AI grading logic
4. **Clean up frontend** - Remove exposed API keys
5. **Add rate limiting** - Prevent abuse (Phase 4)

---

**Last Updated:** December 14, 2025  
**Part of:** Week 1-2 Sprint (Infrastructure & Security)
