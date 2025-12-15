-- Add mood column to quiz_attempts table
-- This stores the user's self-reported mood during the quiz (midpoint check-in)

ALTER TABLE public.quiz_attempts 
ADD COLUMN mood text;

-- Add check constraint to ensure valid mood values
ALTER TABLE public.quiz_attempts
ADD CONSTRAINT quiz_attempts_mood_check 
CHECK (mood IS NULL OR mood IN ('confident', 'okay', 'struggling', 'confused'));

-- Add comment to document the column
COMMENT ON COLUMN public.quiz_attempts.mood IS 'User''s self-reported mood during quiz (captured at midpoint)';
