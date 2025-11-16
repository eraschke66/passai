-- =============================================
-- Plant States Table
-- =============================================
-- Tracks the "garden growth" for each subject
-- Part of psychological engagement system (replaces badges/streaks)

create table public.plant_states (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid not null,
  level integer not null default 1,
  points integer not null default 0,
  health integer not null default 100, -- 0-100 percentage (based on study consistency)
  last_tended_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint plant_states_pkey primary key (id),
  constraint plant_states_user_subject_unique unique (user_id, subject_id),
  constraint plant_states_user_id_fkey foreign key (user_id) 
    references auth.users (id) on delete cascade,
  constraint plant_states_subject_id_fkey foreign key (subject_id) 
    references subjects (id) on delete cascade,
  constraint plant_states_level_check check (level >= 1 and level <= 100),
  constraint plant_states_points_check check (points >= 0),
  constraint plant_states_health_check check (health >= 0 and health <= 100)
) tablespace pg_default;

-- =============================================
-- Indexes
-- =============================================

create index if not exists plant_states_user_id_idx 
  on public.plant_states using btree (user_id) tablespace pg_default;

create index if not exists plant_states_subject_id_idx 
  on public.plant_states using btree (subject_id) tablespace pg_default;

create index if not exists plant_states_health_idx 
  on public.plant_states using btree (health) tablespace pg_default;

create index if not exists plant_states_user_subject_idx
  on public.plant_states using btree (user_id, subject_id) tablespace pg_default;

-- =============================================
-- Trigger for updated_at
-- =============================================

create trigger plant_states_updated_at 
before update on plant_states 
for each row 
execute function update_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table public.plant_states enable row level security;

-- Policy: Users can only view their own plant states
create policy "Users can view own plant states"
  on public.plant_states
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own plant states
create policy "Users can insert own plant states"
  on public.plant_states
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own plant states
create policy "Users can update own plant states"
  on public.plant_states
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own plant states
create policy "Users can delete own plant states"
  on public.plant_states
  for delete
  using (auth.uid() = user_id);

-- =============================================
-- Comments
-- =============================================

comment on table public.plant_states is 
  'Tracks garden growth state for each subject. Part of psychological engagement system.';

comment on column public.plant_states.level is 
  'Current garden level (increases every 100 points). Range: 1-100';

comment on column public.plant_states.points is 
  'Total points earned. 10 points per correct answer. Used to calculate level.';

comment on column public.plant_states.health is 
  'Garden health percentage (0-100). Based on 7-day study consistency.';

comment on column public.plant_states.last_tended_at is 
  'Last time user studied this subject (quiz completion or study session).';
