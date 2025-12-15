-- =====================================================
-- TABLE: material_coverage
-- Description: Tracks how much of each study material has been reviewed
-- =====================================================

create table public.material_coverage (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  material_id uuid not null,
  coverage_percentage integer not null default 0,
  time_spent_minutes integer not null default 0,
  last_accessed_at timestamp with time zone null,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint material_coverage_pkey primary key (id),
  constraint material_coverage_user_id_fkey foreign key (user_id) 
    references auth.users (id) on delete cascade,
  constraint material_coverage_subject_id_fkey foreign key (subject_id) 
    references subjects (id) on delete cascade,
  constraint material_coverage_material_id_fkey foreign key (material_id) 
    references study_materials (id) on delete cascade,
  
  -- Unique constraint: one coverage record per user/material combination
  constraint material_coverage_user_material_unique 
    unique (user_id, material_id),
  
  -- Check constraints
  constraint material_coverage_coverage_percentage_check check (
    (coverage_percentage >= 0)
    and (coverage_percentage <= 100)
  ),
  constraint material_coverage_time_spent_minutes_check check (time_spent_minutes >= 0),
  constraint material_coverage_notes_check check (
    (notes is null)
    or (char_length(notes) <= 2000)
  )
) tablespace pg_default;

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_material_coverage_user_id 
  on public.material_coverage using btree (user_id) tablespace pg_default;

create index if not exists idx_material_coverage_subject_id 
  on public.material_coverage using btree (subject_id) tablespace pg_default;

create index if not exists idx_material_coverage_material_id 
  on public.material_coverage using btree (material_id) tablespace pg_default;

create index if not exists idx_material_coverage_user_subject 
  on public.material_coverage using btree (user_id, subject_id) tablespace pg_default;

create index if not exists idx_material_coverage_percentage 
  on public.material_coverage using btree (coverage_percentage) tablespace pg_default;

create index if not exists idx_material_coverage_last_accessed 
  on public.material_coverage using btree (last_accessed_at desc) tablespace pg_default
  where (last_accessed_at is not null);

-- =====================================================
-- TRIGGERS
-- =====================================================

create trigger trigger_update_material_coverage_updated_at 
  before update on material_coverage 
  for each row
  execute function update_updated_at ();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.material_coverage enable row level security;

-- Policy: Users can view their own material coverage
create policy "Users can view their own material coverage"
  on public.material_coverage
  for select
  using (auth.uid() = user_id);

-- Policy: Users can create their own material coverage records
create policy "Users can create their own material coverage"
  on public.material_coverage
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own material coverage records
create policy "Users can update their own material coverage"
  on public.material_coverage
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own material coverage records
create policy "Users can delete their own material coverage"
  on public.material_coverage
  for delete
  using (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.material_coverage is 'Tracks how much of each study material has been reviewed by the student';
comment on column public.material_coverage.coverage_percentage is 'Percentage of material that has been covered (0-100)';
comment on column public.material_coverage.time_spent_minutes is 'Total time spent studying this material';
comment on column public.material_coverage.last_accessed_at is 'Timestamp of most recent access to this material';
comment on column public.material_coverage.notes is 'Optional notes about studying this material';
