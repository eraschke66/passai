-- =====================================================
-- TABLE: study_sessions
-- Description: Tracks individual study sessions for consistency and streak calculation
-- =====================================================

create table public.study_sessions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  session_date date not null,
  duration_minutes integer not null,
  topics_covered text[] null,
  materials_used uuid[] null,
  mood text null,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint study_sessions_pkey primary key (id),
  constraint study_sessions_user_id_fkey foreign key (user_id) 
    references auth.users (id) on delete cascade,
  constraint study_sessions_subject_id_fkey foreign key (subject_id) 
    references subjects (id) on delete cascade,
  
  -- Check constraints
  constraint study_sessions_duration_minutes_check check (duration_minutes > 0),
  constraint study_sessions_mood_check check (
    (mood is null)
    or (mood = any (array['confident'::text, 'okay'::text, 'struggling'::text, 'confused'::text]))
  ),
  constraint study_sessions_notes_check check (
    (notes is null)
    or (char_length(notes) <= 2000)
  ),
  constraint study_sessions_session_date_check check (
    session_date <= current_date
  )
) tablespace pg_default;

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_study_sessions_user_id 
  on public.study_sessions using btree (user_id) tablespace pg_default;

create index if not exists idx_study_sessions_subject_id 
  on public.study_sessions using btree (subject_id) tablespace pg_default;

create index if not exists idx_study_sessions_user_subject 
  on public.study_sessions using btree (user_id, subject_id) tablespace pg_default;

create index if not exists idx_study_sessions_session_date 
  on public.study_sessions using btree (session_date desc) tablespace pg_default;

create index if not exists idx_study_sessions_user_date 
  on public.study_sessions using btree (user_id, session_date desc) tablespace pg_default;

create index if not exists idx_study_sessions_mood 
  on public.study_sessions using btree (mood) tablespace pg_default
  where (mood is not null);

-- =====================================================
-- TRIGGERS
-- =====================================================

create trigger trigger_update_study_sessions_updated_at 
  before update on study_sessions 
  for each row
  execute function update_updated_at ();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.study_sessions enable row level security;

-- Policy: Users can view their own study sessions
create policy "Users can view their own study sessions"
  on public.study_sessions
  for select
  using (auth.uid() = user_id);

-- Policy: Users can create their own study sessions
create policy "Users can create their own study sessions"
  on public.study_sessions
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own study sessions
create policy "Users can update their own study sessions"
  on public.study_sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own study sessions
create policy "Users can delete their own study sessions"
  on public.study_sessions
  for delete
  using (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.study_sessions is 'Logs individual study sessions for tracking consistency, streaks, and study patterns';
comment on column public.study_sessions.session_date is 'The date of the study session';
comment on column public.study_sessions.duration_minutes is 'How long the study session lasted';
comment on column public.study_sessions.topics_covered is 'Array of topic names studied during this session';
comment on column public.study_sessions.materials_used is 'Array of material IDs used during this session';
comment on column public.study_sessions.mood is 'How the student felt during the session: confident, okay, struggling, or confused';
comment on column public.study_sessions.notes is 'Optional notes about the session';
