-- =====================================================
-- MIGRATION: Add concept field to questions table
-- Description: Adds fine-grained concept tracking to support BKT calculations
-- =====================================================

-- Add the concept column (nullable initially for existing records)
alter table public.questions 
  add column if not exists concept text null;

-- Add check constraint for concept length
alter table public.questions 
  add constraint questions_concept_check check (
    (concept is null)
    or (
      (char_length(concept) >= 1)
      and (char_length(concept) <= 255)
    )
  );

-- Create index on concept for efficient filtering
create index if not exists idx_questions_concept 
  on public.questions using btree (concept) tablespace pg_default
  where (concept is not null);

-- Create composite index for topic and concept together
create index if not exists idx_questions_topic_concept 
  on public.questions using btree (topic, concept) tablespace pg_default;

-- =====================================================
-- DATA MIGRATION: Backfill concept from topic for existing records
-- =====================================================

-- For existing questions, set concept to be the same as topic initially
-- This can be refined later by AI or manual updates
update public.questions
set concept = topic
where concept is null;

-- =====================================================
-- COMMENTS
-- =====================================================

comment on column public.questions.concept is 'Fine-grained concept/skill being tested (more specific than topic) - used for BKT mastery tracking';

-- =====================================================
-- NOTES
-- =====================================================
-- The 'concept' field allows for more granular mastery tracking than 'topic'
-- Example: 
--   topic = "Photosynthesis"
--   concept = "Light-dependent reactions" or "Calvin cycle"
-- 
-- This enables BKT to track mastery at a more detailed level,
-- providing better predictions and more targeted study recommendations
