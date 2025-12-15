# DEPRECATED: Frontend OpenAI Client

**Date Deprecated:** December 14, 2025  
**Reason:** Security - Moved OpenAI API calls to Edge Functions

## What Happened

The files in this directory have been deprecated because they exposed OpenAI API keys in the frontend bundle, which is a critical security vulnerability.

## Migration

All OpenAI functionality has been moved to secure Supabase Edge Functions:

### Edge Functions Created
1. **generate-quiz** - Quiz question generation
   - Location: `supabase/functions/generate-quiz/index.ts`
   - Usage: `supabase.functions.invoke('generate-quiz', {...})`

2. **grade-response** - AI grading for short-answer and essay questions
   - Location: `supabase/functions/grade-response/index.ts`
   - Usage: `supabase.functions.invoke('grade-response', {...})`

### Frontend Changes
- `src/features/quizzes/services/quizzesService.ts` - Now calls `generate-quiz` Edge Function
- `src/features/quizzes/utils/answerValidation.ts` - Now calls `grade-response` Edge Function

## Files Deprecated

- `openai.ts` - Frontend OpenAI client (8 lines)
- This file has been replaced with server-side Edge Functions

## Environment Variables Removed

- `VITE_OPENAI_API_KEY` - No longer needed in frontend (now in Supabase secrets)

## Documentation

See `work_md/OPENAI_EDGE_FUNCTIONS_MIGRATION.md` for complete migration details.
