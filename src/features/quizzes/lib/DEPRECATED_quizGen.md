# DEPRECATED: Frontend Quiz Generation

**Date Deprecated:** December 14, 2025  
**File:** `quizGen.ts` (354 lines)  
**Reason:** Security - Moved to Edge Function

## What Happened

The quiz generation logic in `quizGen.ts` has been migrated to a secure Edge Function to prevent exposing the OpenAI API key in the frontend bundle.

## Migration

### Old Approach (DEPRECATED)
```typescript
import { generateQuizQuestions } from "../lib/quizGen";

const questions = await generateQuizQuestions(
  combinedText,
  settings,
  subject
);
```

### New Approach (SECURE)
```typescript
const { data, error } = await supabase.functions.invoke(
  "generate-quiz",
  {
    body: {
      subjectId,
      materialIds,
      settings,
    },
  }
);
```

## Edge Function Location

`supabase/functions/generate-quiz/index.ts` (530+ lines)

## Features Preserved

All features from the original implementation have been ported:
- Curriculum-aligned prompts (IB, AP, A-Level, GCSE, etc.)
- Teacher layer customization (exam board, question style, emphasis)
- All question types (MC, true-false, short-answer, essay)
- Concept tagging for BKT tracking
- Cognitive level distribution (recall, understand, apply, analyze)

## Frontend Changes

Updated in: `src/features/quizzes/services/quizzesService.ts`
- Line 11: Commented out import
- Lines 240+: Replaced direct call with Edge Function invocation

## Status

This file will be deleted after full testing and verification of the Edge Function implementation.
