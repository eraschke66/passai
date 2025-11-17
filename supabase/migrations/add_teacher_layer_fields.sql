-- Add Teacher Layer fields to subjects table
-- This enables curriculum-aligned quiz generation based on exam board, 
-- teacher preferences, and grading expectations

-- Add question_style column with constraint
ALTER TABLE subjects
ADD COLUMN question_style TEXT DEFAULT 'multiple_choice';

-- Add grading_rubric column
ALTER TABLE subjects
ADD COLUMN grading_rubric TEXT;

-- Add constraint for valid question styles
ALTER TABLE subjects
ADD CONSTRAINT valid_question_style 
CHECK (question_style IN ('multiple_choice', 'short_answer', 'essay', 'mixed'));

-- Add comment explaining the columns
COMMENT ON COLUMN subjects.question_style IS 'Format of questions to generate: multiple_choice, short_answer, essay, or mixed';
COMMENT ON COLUMN subjects.grading_rubric IS 'How the teacher grades - used to align answer format with expectations';

-- Create index for faster filtering by question style
CREATE INDEX idx_subjects_question_style ON subjects(question_style);
