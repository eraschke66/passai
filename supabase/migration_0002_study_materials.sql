-- Migration: Create study_materials table and storage buckets
-- Description: Adds support for material upload and management
-- Dependencies: Requires auth.users and subjects table

-- =====================================================
-- 1. Create study_materials table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- File metadata
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'text', 'docx', 'pptx')),
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    storage_path TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Extracted content
    text_content TEXT,
    
    -- Processing status
    processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        processing_status IN ('pending', 'processing', 'ready', 'failed')
    ),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Indexes for common queries
    CONSTRAINT unique_storage_path UNIQUE (storage_path)
);

-- =====================================================
-- 2. Create indexes for performance
-- =====================================================
CREATE INDEX idx_study_materials_user_id ON public.study_materials(user_id);
CREATE INDEX idx_study_materials_subject_id ON public.study_materials(subject_id);
CREATE INDEX idx_study_materials_processing_status ON public.study_materials(processing_status);
CREATE INDEX idx_study_materials_created_at ON public.study_materials(created_at DESC);
CREATE INDEX idx_study_materials_user_subject ON public.study_materials(user_id, subject_id);

-- =====================================================
-- 3. Create updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_study_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_study_materials_updated_at
    BEFORE UPDATE ON public.study_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_study_materials_updated_at();

-- =====================================================
-- 4. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own materials
CREATE POLICY "Users can view their own materials"
    ON public.study_materials
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own materials
CREATE POLICY "Users can insert their own materials"
    ON public.study_materials
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own materials
CREATE POLICY "Users can update their own materials"
    ON public.study_materials
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own materials
CREATE POLICY "Users can delete their own materials"
    ON public.study_materials
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. Create storage buckets (run these in Supabase Dashboard or via API)
-- =====================================================
-- Note: Storage buckets need to be created via Supabase Dashboard or API
-- Below is the configuration you'll need:

-- Bucket: materials
-- - Public: false
-- - File size limit: 50MB
-- - Allowed MIME types: application/pdf, image/jpeg, image/png, text/plain, 
--   application/vnd.openxmlformats-officedocument.wordprocessingml.document,
--   application/vnd.openxmlformats-officedocument.presentationml.presentation

-- Bucket: thumbnails
-- - Public: false
-- - File size limit: 2MB
-- - Allowed MIME types: image/jpeg, image/png

-- =====================================================
-- 6. Storage RLS Policies
-- =====================================================
-- Note: These policies should be added in Supabase Dashboard under Storage > Policies

-- Materials bucket policies:
-- 1. Users can upload to their own folder
--    Operation: INSERT
--    Policy: (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 2. Users can view their own files
--    Operation: SELECT
--    Policy: (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 3. Users can update their own files
--    Operation: UPDATE
--    Policy: (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 4. Users can delete their own files
--    Operation: DELETE
--    Policy: (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)

-- Thumbnails bucket policies (same as above, but for 'thumbnails' bucket):
-- 1. Users can upload to their own folder
--    Operation: INSERT
--    Policy: (bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 2. Users can view their own files
--    Operation: SELECT
--    Policy: (bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 3. Users can update their own files
--    Operation: UPDATE
--    Policy: (bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)

-- 4. Users can delete their own files
--    Operation: DELETE
--    Policy: (bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)

-- =====================================================
-- 7. Helper function to get user's storage usage
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_storage_usage(user_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(file_size), 0)
        FROM public.study_materials
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_storage_usage(UUID) TO authenticated;

-- =====================================================
-- 8. Comments for documentation
-- =====================================================
COMMENT ON TABLE public.study_materials IS 'Stores uploaded study materials and their extracted text content';
COMMENT ON COLUMN public.study_materials.file_type IS 'Type of file: pdf, image, text, docx, or pptx';
COMMENT ON COLUMN public.study_materials.processing_status IS 'Status of text extraction: pending, processing, ready, or failed';
COMMENT ON COLUMN public.study_materials.text_content IS 'Extracted text content used for quiz generation';
COMMENT ON COLUMN public.study_materials.storage_path IS 'Path to file in Supabase storage bucket';
