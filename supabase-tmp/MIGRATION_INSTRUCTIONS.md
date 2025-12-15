# Teacher Layer Migration Instructions

## 📋 Migration: Add Teacher Layer Fields

**File:** `supabase/migrations/add_teacher_layer_fields.sql`  
**Date:** November 17, 2025

---

## 🚀 How to Run This Migration

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**

### Step 2: Execute Migration

1. Copy the entire contents of `supabase/migrations/add_teacher_layer_fields.sql`
2. Paste into the SQL Editor
3. Click **"Run"** to execute

### Step 3: Verify Migration

Run this verification query:

```sql
-- Check new columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'subjects'
AND column_name IN ('question_style', 'grading_rubric');

-- Check constraint exists
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'valid_question_style';

-- Check index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'subjects'
AND indexname = 'idx_subjects_question_style';
```

Expected result:

- `question_style` column exists (TEXT, default 'multiple_choice')
- `grading_rubric` column exists (TEXT, nullable)
- Constraint `valid_question_style` exists
- Index `idx_subjects_question_style` exists

### Step 4: Test with Sample Data

```sql
-- Test inserting with new fields
INSERT INTO subjects (
  user_id,
  name,
  exam_board,
  question_style,
  grading_rubric
) VALUES (
  auth.uid(),
  'Test Biology',
  'IB',
  'mixed',
  'Focus on clear explanations and diagrams'
);

-- Test constraint (should fail)
INSERT INTO subjects (
  user_id,
  name,
  question_style
) VALUES (
  auth.uid(),
  'Test Invalid',
  'invalid_style'  -- This should fail due to constraint
);
```

---

## ✅ What This Migration Does

1. **Adds `question_style` column**

   - Type: TEXT
   - Default: 'multiple_choice'
   - Constraint: Must be one of ('multiple_choice', 'short_answer', 'essay', 'mixed')
   - Purpose: Specify format of questions to generate

2. **Adds `grading_rubric` column**

   - Type: TEXT
   - Nullable: Yes
   - Purpose: Store how teacher grades (used to align answer format)

3. **Creates index on `question_style`**

   - Speeds up filtering subjects by question style
   - Useful for analytics/reports

4. **Adds helpful comments**
   - Documents column purposes in database

---

## 🔄 Rollback (If Needed)

If you need to undo this migration:

```sql
-- Remove index
DROP INDEX IF EXISTS idx_subjects_question_style;

-- Remove constraint
ALTER TABLE subjects DROP CONSTRAINT IF EXISTS valid_question_style;

-- Remove columns
ALTER TABLE subjects DROP COLUMN IF EXISTS grading_rubric;
ALTER TABLE subjects DROP COLUMN IF EXISTS question_style;
```

---

## 📝 Related Files Updated

- ✅ `src/features/subjects/types/subject.types.ts` - TypeScript types updated
- ⏳ `src/features/subjects/components/SubjectForm.tsx` - Next to update
- ⏳ `src/features/quizzes/lib/quizGen.ts` - Will use new fields

---

## 🎯 Next Steps After Migration

1. ✅ Verify migration successful
2. ⏳ Update SubjectForm to collect new fields
3. ⏳ Update quiz generation to use new fields
4. ⏳ Test with different exam boards

---

**Status:** Ready to run ✅
