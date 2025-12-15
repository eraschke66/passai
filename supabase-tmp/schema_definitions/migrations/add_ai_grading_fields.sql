-- Add AI grading fields to user_answers table
-- This enables AI-powered grading for short answer and essay questions

-- Add grading_score column (0-100 for partial credit)
ALTER TABLE user_answers 
ADD COLUMN IF NOT EXISTS grading_score INTEGER CHECK (grading_score >= 0 AND grading_score <= 100);

-- Add ai_grading_feedback column (detailed feedback from AI)
ALTER TABLE user_answers 
ADD COLUMN IF NOT EXISTS ai_grading_feedback TEXT;

-- Add grading_status column (tracks grading progress)
DO $$ BEGIN
  CREATE TYPE grading_status_enum AS ENUM ('pending', 'grading', 'graded', 'not_required');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE user_answers 
ADD COLUMN IF NOT EXISTS grading_status grading_status_enum DEFAULT 'not_required';

-- Create index for grading_status to optimize queries for pending grading
CREATE INDEX IF NOT EXISTS idx_user_answers_grading_status 
ON user_answers(grading_status) 
WHERE grading_status IN ('pending', 'grading');

-- Add comment for documentation
COMMENT ON COLUMN user_answers.grading_score IS 'AI-assigned score (0-100) for short answer and essay questions';
COMMENT ON COLUMN user_answers.ai_grading_feedback IS 'Detailed feedback from AI grading system';
COMMENT ON COLUMN user_answers.grading_status IS 'Tracks whether answer needs AI grading: not_required (MC/TF), pending (awaiting grading), grading (in progress), graded (complete)';
