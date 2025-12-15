-- =====================================================
-- TABLE: study_plan_topics
-- Description: Topics/concepts within a study plan (accordion items)
-- =====================================================

create table public.study_plan_topics (
  id uuid not null default gen_random_uuid (),
  study_plan_id uuid not null,
  title text not null,
  description text null,
  order_index integer not null,
  total_time_minutes integer not null,
  total_tasks integer not null default 0,
  status text not null default 'not_started'::text,
  mastery_level integer null default 0,
  priority text not null default 'medium'::text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint study_plan_topics_pkey primary key (id),
  constraint study_plan_topics_study_plan_id_fkey foreign key (study_plan_id) 
    references study_plans (id) on delete cascade,
  
  -- Unique constraint: each plan's topics have unique order
  constraint study_plan_topics_plan_order_unique unique (study_plan_id, order_index),
  
  -- Check constraints
  constraint study_plan_topics_title_check check (
    (char_length(title) >= 1)
    and (char_length(title) <= 200)
  ),
  constraint study_plan_topics_description_check check (
    (description is null)
    or (char_length(description) <= 1000)
  ),
  constraint study_plan_topics_order_index_check check (order_index >= 0),
  constraint study_plan_topics_total_time_minutes_check check (total_time_minutes > 0),
  constraint study_plan_topics_total_tasks_check check (total_tasks >= 0),
  constraint study_plan_topics_status_check check (
    status = any (array['not_started'::text, 'in_progress'::text, 'completed'::text])
  ),
  constraint study_plan_topics_mastery_level_check check (
    (mastery_level is null)
    or (
      (mastery_level >= 0)
      and (mastery_level <= 100)
    )
  ),
  constraint study_plan_topics_priority_check check (
    priority = any (array['high'::text, 'medium'::text, 'low'::text])
  )
) tablespace pg_default;

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_study_plan_topics_study_plan_id 
  on public.study_plan_topics using btree (study_plan_id) tablespace pg_default;

create index if not exists idx_study_plan_topics_order 
  on public.study_plan_topics using btree (study_plan_id, order_index) tablespace pg_default;

create index if not exists idx_study_plan_topics_status 
  on public.study_plan_topics using btree (status) tablespace pg_default;

create index if not exists idx_study_plan_topics_priority 
  on public.study_plan_topics using btree (priority) tablespace pg_default;

create index if not exists idx_study_plan_topics_mastery_level 
  on public.study_plan_topics using btree (mastery_level) tablespace pg_default
  where (mastery_level is not null);

-- =====================================================
-- TRIGGERS
-- =====================================================

create trigger trigger_update_study_plan_topics_updated_at 
  before update on study_plan_topics 
  for each row
  execute function update_updated_at ();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.study_plan_topics enable row level security;

-- Policy: Users can view topics of their own study plans
create policy "Users can view their own study plan topics"
  on public.study_plan_topics
  for select
  using (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_topics.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can create topics in their own study plans
create policy "Users can create topics in their own study plans"
  on public.study_plan_topics
  for insert
  with check (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_topics.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can update topics in their own study plans
create policy "Users can update their own study plan topics"
  on public.study_plan_topics
  for update
  using (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_topics.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_topics.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can delete topics from their own study plans
create policy "Users can delete their own study plan topics"
  on public.study_plan_topics
  for delete
  using (
    exists (
      select 1 from study_plans
      where study_plans.id = study_plan_topics.study_plan_id
      and study_plans.user_id = auth.uid()
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.study_plan_topics is 'Topics or concepts within a study plan - displayed as accordion sections';
comment on column public.study_plan_topics.title is 'The name of the topic/concept to study';
comment on column public.study_plan_topics.description is 'Detailed description of what to learn in this topic';
comment on column public.study_plan_topics.order_index is 'Order in which topics should be studied (0-based)';
comment on column public.study_plan_topics.total_time_minutes is 'Estimated time to complete all tasks in this topic';
comment on column public.study_plan_topics.total_tasks is 'Number of tasks in this topic';
comment on column public.study_plan_topics.status is 'Progress status: not_started, in_progress, or completed';
comment on column public.study_plan_topics.mastery_level is 'Current mastery level for this topic (0-100) from BKT';
comment on column public.study_plan_topics.priority is 'Importance level: high, medium, or low';
