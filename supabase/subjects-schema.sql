-- =============================================
-- PassAI Database Schema - Subject Management
-- Phase 2: Subjects
-- =============================================

-- =============================================
-- SUBJECTS TABLE
-- =============================================
-- Stores user subjects/courses they are studying
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name TEXT NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 100),
    description TEXT CHECK (description IS NULL OR char_length(description) <= 500),
    
    -- Exam Details
    test_date DATE CHECK (test_date IS NULL OR test_date >= CURRENT_DATE),
    exam_board TEXT CHECK (exam_board IS NULL OR char_length(exam_board) <= 100),
    teacher_emphasis TEXT CHECK (teacher_emphasis IS NULL OR char_length(teacher_emphasis) <= 500),
    
    -- Visual Customization
    icon TEXT NOT NULL DEFAULT 'book',
    color TEXT NOT NULL DEFAULT 'blue',
    
    -- Progress Tracking
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    pass_chance INTEGER CHECK (pass_chance IS NULL OR (pass_chance >= 0 AND pass_chance <= 100)),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_studied_at TIMESTAMPTZ,
    
    -- Ensure user_id + name combination is unique per user
    UNIQUE(user_id, name)
);

-- =============================================
-- INDEXES
-- =============================================

-- Index on user_id for faster lookups of user's subjects
CREATE INDEX IF NOT EXISTS subjects_user_id_idx ON public.subjects(user_id);

-- Index on test_date for sorting by upcoming exams
CREATE INDEX IF NOT EXISTS subjects_test_date_idx ON public.subjects(test_date) WHERE test_date IS NOT NULL;

-- Index on created_at for sorting by newest
CREATE INDEX IF NOT EXISTS subjects_created_at_idx ON public.subjects(created_at DESC);

-- Index on progress for sorting by progress
CREATE INDEX IF NOT EXISTS subjects_progress_idx ON public.subjects(progress);

-- Composite index for common queries (user's subjects sorted by test date)
CREATE INDEX IF NOT EXISTS subjects_user_test_date_idx ON public.subjects(user_id, test_date) WHERE test_date IS NOT NULL;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own subjects
CREATE POLICY "Users can view own subjects"
    ON public.subjects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own subjects
CREATE POLICY "Users can insert own subjects"
    ON public.subjects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own subjects
CREATE POLICY "Users can update own subjects"
    ON public.subjects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own subjects
CREATE POLICY "Users can delete own subjects"
    ON public.subjects
    FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_subject_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger: Update updated_at on subject changes
CREATE TRIGGER subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_subject_updated_at();

-- =============================================
-- GRANTS
-- =============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.subjects TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.subjects IS 'User subjects/courses they are studying for';
COMMENT ON COLUMN public.subjects.id IS 'Primary key';
COMMENT ON COLUMN public.subjects.user_id IS 'References auth.users.id - owner of the subject';
COMMENT ON COLUMN public.subjects.name IS 'Subject name (e.g., Biology Midterm) - max 100 chars';
COMMENT ON COLUMN public.subjects.description IS 'Optional description - max 500 chars';
COMMENT ON COLUMN public.subjects.test_date IS 'Date of the exam/test - must be future date or null';
COMMENT ON COLUMN public.subjects.exam_board IS 'Type of exam board (e.g., AP, IB, GCSE) - optional';
COMMENT ON COLUMN public.subjects.teacher_emphasis IS 'What the teacher emphasized - optional';
COMMENT ON COLUMN public.subjects.icon IS 'Icon identifier for visual distinction';
COMMENT ON COLUMN public.subjects.color IS 'Color identifier for visual distinction';
COMMENT ON COLUMN public.subjects.progress IS 'Study progress percentage (0-100)';
COMMENT ON COLUMN public.subjects.pass_chance IS 'Predicted pass probability (0-100) - null if insufficient data';
COMMENT ON COLUMN public.subjects.last_studied_at IS 'Last time user studied this subject (quiz taken, material uploaded, etc.)';

-- =============================================
-- SAMPLE DATA (for development/testing)
-- =============================================
-- Uncomment below to insert sample data for testing
-- Note: Replace 'YOUR_USER_ID' with an actual user ID from auth.users

/*
INSERT INTO public.subjects (user_id, name, description, test_date, exam_board, icon, color, progress, pass_chance)
VALUES 
    ('YOUR_USER_ID', 'Biology Midterm', 'Chapters 1-5, focus on cell biology and genetics', '2025-12-15', 'AP Biology', 'microscope', 'green', 45, 68),
    ('YOUR_USER_ID', 'Chemistry Final', 'Organic chemistry and thermodynamics', '2025-12-20', 'General Chemistry', 'flask', 'purple', 30, NULL),
    ('YOUR_USER_ID', 'History Quiz', 'World War II and Cold War era', '2025-11-25', NULL, 'scroll', 'amber', 75, 85);
*/
