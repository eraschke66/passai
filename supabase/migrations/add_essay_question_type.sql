-- Add 'essay' type to questions table type constraint
-- This enables essay questions for AI-powered grading system

-- Drop the existing constraint
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check;

-- Recreate the constraint with 'essay' included
ALTER TABLE questions ADD CONSTRAINT questions_type_check 
CHECK (
  type = ANY (
    ARRAY[
      'multiple-choice'::text,
      'true-false'::text,
      'short-answer'::text,
      'essay'::text,
      'matching'::text
    ]
  )
);

-- Add comment for documentation
COMMENT ON CONSTRAINT questions_type_check ON questions IS 
'Allowed question types: multiple-choice (4 options), true-false (2 options), short-answer (AI graded), essay (AI graded), matching (future)';
