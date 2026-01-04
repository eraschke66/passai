-- Add support for fill-in-blank question type
-- Migration: Add 'fill-in-blank' to questions.type constraint

-- Drop the existing constraint
ALTER TABLE public.questions
DROP CONSTRAINT IF EXISTS questions_type_check;

-- Add the updated constraint with 'fill-in-blank' included
ALTER TABLE public.questions
ADD CONSTRAINT questions_type_check
CHECK (type = ANY (ARRAY[
  'multiple-choice'::text,
  'true-false'::text,
  'short-answer'::text,
  'matching'::text,
  'essay'::text,
  'fill-in-blank'::text
]));

-- Add comment to document the change
COMMENT ON COLUMN public.questions.type IS 'Question type: multiple-choice, true-false, short-answer, matching, essay, or fill-in-blank';
