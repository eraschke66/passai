-- Migration: Add RAG Pipeline Support
-- Enable pgvector, create chunks table, embeddings index, and search function

-- =====================================================
-- 1. Enable pgvector Extension
-- =====================================================
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 2. Create material_chunks Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.material_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Chunk content
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    
    -- Embeddings (1536 dimensions for OpenAI text-embedding-3-small)
    embedding VECTOR(1536),
    
    -- Metadata
    chunk_metadata JSONB DEFAULT '{}',
    token_count INTEGER NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(material_id, chunk_index)
);

-- =====================================================
-- 3. Create Indexes
-- =====================================================
CREATE INDEX idx_material_chunks_material_id ON public.material_chunks(material_id);
CREATE INDEX idx_material_chunks_user_id ON public.material_chunks(user_id);

-- Vector similarity index (HNSW for fast approximate search)
CREATE INDEX idx_material_chunks_embedding ON public.material_chunks 
    USING hnsw (embedding vector_cosine_ops);

-- =====================================================
-- 4. Enable RLS and Policies
-- =====================================================
ALTER TABLE public.material_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chunks"
    ON public.material_chunks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chunks"
    ON public.material_chunks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chunks"
    ON public.material_chunks FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. Update Trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_material_chunks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_material_chunks_updated_at
    BEFORE UPDATE ON public.material_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_material_chunks_updated_at();

-- =====================================================
-- 6. Vector Search Function
-- =====================================================
CREATE OR REPLACE FUNCTION search_material_chunks(
    query_embedding VECTOR(1536),
    user_material_ids UUID[],
    match_count INT DEFAULT 10,
    similarity_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    chunk_id UUID,
    material_id UUID,
    chunk_text TEXT,
    chunk_metadata JSONB,
    token_count INTEGER,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        mc.id AS chunk_id,
        mc.material_id,
        mc.chunk_text,
        mc.chunk_metadata,
        mc.token_count,
        1 - (mc.embedding <=> query_embedding) AS similarity
    FROM material_chunks mc
    WHERE
        mc.material_id = ANY(user_material_ids)
        AND mc.embedding IS NOT NULL
        AND (1 - (mc.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY mc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
