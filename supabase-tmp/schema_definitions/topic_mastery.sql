-- =====================================================
-- TABLE: topic_mastery
-- Description: Tracks mastery level per topic using Bayesian Knowledge Tracing (BKT)
-- =====================================================

create table public.topic_mastery (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  topic_name text not null,
  mastery_level integer not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  total_attempts integer not null default 0,
  last_practiced_at timestamp with time zone null,
  
  -- BKT probability parameters
  p_learned real not null default 0.5,
  p_known real not null default 0.5,
  p_init real not null default 0.3,
  p_transit real not null default 0.1,
  p_guess real not null default 0.25,
  p_slip real not null default 0.1,
  
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint topic_mastery_pkey primary key (id),
  constraint topic_mastery_user_id_fkey foreign key (user_id) 
    references auth.users (id) on delete cascade,
  constraint topic_mastery_subject_id_fkey foreign key (subject_id) 
    references subjects (id) on delete cascade,
  
  -- Unique constraint: one mastery record per user/subject/topic combination
  constraint topic_mastery_user_subject_topic_unique 
    unique (user_id, subject_id, topic_name),
  
  -- Check constraints
  constraint topic_mastery_topic_name_check check (
    (char_length(topic_name) >= 1)
    and (char_length(topic_name) <= 200)
  ),
  constraint topic_mastery_mastery_level_check check (
    (mastery_level >= 0)
    and (mastery_level <= 100)
  ),
  constraint topic_mastery_correct_count_check check (correct_count >= 0),
  constraint topic_mastery_incorrect_count_check check (incorrect_count >= 0),
  constraint topic_mastery_total_attempts_check check (
    total_attempts >= 0
    and total_attempts = (correct_count + incorrect_count)
  ),
  
  -- BKT probability constraints (must be between 0 and 1)
  constraint topic_mastery_p_learned_check check (
    (p_learned >= 0) and (p_learned <= 1)
  ),
  constraint topic_mastery_p_known_check check (
    (p_known >= 0) and (p_known <= 1)
  ),
  constraint topic_mastery_p_init_check check (
    (p_init >= 0) and (p_init <= 1)
  ),
  constraint topic_mastery_p_transit_check check (
    (p_transit >= 0) and (p_transit <= 1)
  ),
  constraint topic_mastery_p_guess_check check (
    (p_guess >= 0) and (p_guess <= 1)
  ),
  constraint topic_mastery_p_slip_check check (
    (p_slip >= 0) and (p_slip <= 1)
  )
) tablespace pg_default;

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_topic_mastery_user_id 
  on public.topic_mastery using btree (user_id) tablespace pg_default;

create index if not exists idx_topic_mastery_subject_id 
  on public.topic_mastery using btree (subject_id) tablespace pg_default;

create index if not exists idx_topic_mastery_user_subject 
  on public.topic_mastery using btree (user_id, subject_id) tablespace pg_default;

create index if not exists idx_topic_mastery_topic_name 
  on public.topic_mastery using btree (topic_name) tablespace pg_default;

create index if not exists idx_topic_mastery_mastery_level 
  on public.topic_mastery using btree (mastery_level) tablespace pg_default;

create index if not exists idx_topic_mastery_last_practiced 
  on public.topic_mastery using btree (last_practiced_at desc) tablespace pg_default
  where (last_practiced_at is not null);

-- =====================================================
-- TRIGGERS
-- =====================================================

create trigger trigger_update_topic_mastery_updated_at 
  before update on topic_mastery 
  for each row
  execute function update_updated_at ();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.topic_mastery enable row level security;

-- Policy: Users can view their own topic mastery data
create policy "Users can view their own topic mastery"
  on public.topic_mastery
  for select
  using (auth.uid() = user_id);

-- Policy: Users can create their own topic mastery records
create policy "Users can create their own topic mastery"
  on public.topic_mastery
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own topic mastery records
create policy "Users can update their own topic mastery"
  on public.topic_mastery
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own topic mastery records
create policy "Users can delete their own topic mastery"
  on public.topic_mastery
  for delete
  using (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.topic_mastery is 'Tracks learning progress and mastery for each topic using Bayesian Knowledge Tracing';
comment on column public.topic_mastery.topic_name is 'Name of the topic/concept being tracked';
comment on column public.topic_mastery.mastery_level is 'Current mastery level (0-100) derived from BKT probabilities';
comment on column public.topic_mastery.correct_count is 'Number of correct answers for this topic';
comment on column public.topic_mastery.incorrect_count is 'Number of incorrect answers for this topic';
comment on column public.topic_mastery.total_attempts is 'Total questions attempted for this topic';
comment on column public.topic_mastery.last_practiced_at is 'Timestamp of most recent practice/quiz on this topic';
comment on column public.topic_mastery.p_learned is 'BKT: Current probability that student has learned the skill';
comment on column public.topic_mastery.p_known is 'BKT: Current probability that student knows the skill';
comment on column public.topic_mastery.p_init is 'BKT: Initial probability of knowing (P(L0))';
comment on column public.topic_mastery.p_transit is 'BKT: Probability of learning transition (P(T))';
comment on column public.topic_mastery.p_guess is 'BKT: Probability of guessing correctly (P(G))';
comment on column public.topic_mastery.p_slip is 'BKT: Probability of making a mistake when known (P(S))';
