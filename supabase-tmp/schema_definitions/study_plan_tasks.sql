-- =====================================================
-- TABLE: study_plan_tasks
-- Description: Individual action items within topics (checkable tasks)
-- =====================================================

create table public.study_plan_tasks (
  id uuid not null default gen_random_uuid (),
  topic_id uuid not null,
  title text not null,
  description text null,
  order_index integer not null,
  estimated_time_minutes integer not null,
  is_completed boolean not null default false,
  completed_at timestamp with time zone null,
  task_type text not null default 'reading'::text,
  resource_links text[] null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint study_plan_tasks_pkey primary key (id),
  constraint study_plan_tasks_topic_id_fkey foreign key (topic_id) 
    references study_plan_topics (id) on delete cascade,
  
  -- Unique constraint: each topic's tasks have unique order
  constraint study_plan_tasks_topic_order_unique unique (topic_id, order_index),
  
  -- Check constraints
  constraint study_plan_tasks_title_check check (
    (char_length(title) >= 1)
    and (char_length(title) <= 200)
  ),
  constraint study_plan_tasks_description_check check (
    (description is null)
    or (char_length(description) <= 1000)
  ),
  constraint study_plan_tasks_order_index_check check (order_index >= 0),
  constraint study_plan_tasks_estimated_time_minutes_check check (estimated_time_minutes > 0),
  constraint study_plan_tasks_task_type_check check (
    task_type = any (array['reading'::text, 'practice'::text, 'quiz'::text, 'review'::text])
  ),
  constraint study_plan_tasks_completed_at_check check (
    (not is_completed and completed_at is null)
    or (is_completed and completed_at is not null)
  )
) tablespace pg_default;

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_study_plan_tasks_topic_id 
  on public.study_plan_tasks using btree (topic_id) tablespace pg_default;

create index if not exists idx_study_plan_tasks_order 
  on public.study_plan_tasks using btree (topic_id, order_index) tablespace pg_default;

create index if not exists idx_study_plan_tasks_is_completed 
  on public.study_plan_tasks using btree (is_completed) tablespace pg_default;

create index if not exists idx_study_plan_tasks_task_type 
  on public.study_plan_tasks using btree (task_type) tablespace pg_default;

create index if not exists idx_study_plan_tasks_completed_at 
  on public.study_plan_tasks using btree (completed_at desc) tablespace pg_default
  where (completed_at is not null);

-- =====================================================
-- TRIGGERS
-- =====================================================

create trigger trigger_update_study_plan_tasks_updated_at 
  before update on study_plan_tasks 
  for each row
  execute function update_updated_at ();

-- =====================================================
-- TRIGGER FUNCTION: Auto-set completed_at timestamp
-- =====================================================

create or replace function handle_task_completion()
returns trigger as $$
begin
  -- If task is being marked as completed, set completed_at to now
  if new.is_completed = true and old.is_completed = false then
    new.completed_at := now();
  end if;
  
  -- If task is being marked as incomplete, clear completed_at
  if new.is_completed = false and old.is_completed = true then
    new.completed_at := null;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger trigger_handle_task_completion
  before update on study_plan_tasks
  for each row
  execute function handle_task_completion();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.study_plan_tasks enable row level security;

-- Policy: Users can view tasks of their own study plan topics
create policy "Users can view their own study plan tasks"
  on public.study_plan_tasks
  for select
  using (
    exists (
      select 1 from study_plan_topics
      join study_plans on study_plans.id = study_plan_topics.study_plan_id
      where study_plan_topics.id = study_plan_tasks.topic_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can create tasks in their own study plan topics
create policy "Users can create tasks in their own study plan topics"
  on public.study_plan_tasks
  for insert
  with check (
    exists (
      select 1 from study_plan_topics
      join study_plans on study_plans.id = study_plan_topics.study_plan_id
      where study_plan_topics.id = study_plan_tasks.topic_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can update tasks in their own study plan topics
create policy "Users can update their own study plan tasks"
  on public.study_plan_tasks
  for update
  using (
    exists (
      select 1 from study_plan_topics
      join study_plans on study_plans.id = study_plan_topics.study_plan_id
      where study_plan_topics.id = study_plan_tasks.topic_id
      and study_plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from study_plan_topics
      join study_plans on study_plans.id = study_plan_topics.study_plan_id
      where study_plan_topics.id = study_plan_tasks.topic_id
      and study_plans.user_id = auth.uid()
    )
  );

-- Policy: Users can delete tasks from their own study plan topics
create policy "Users can delete their own study plan tasks"
  on public.study_plan_tasks
  for delete
  using (
    exists (
      select 1 from study_plan_topics
      join study_plans on study_plans.id = study_plan_topics.study_plan_id
      where study_plan_topics.id = study_plan_tasks.topic_id
      and study_plans.user_id = auth.uid()
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.study_plan_tasks is 'Individual action items within topics - displayed as checkable tasks';
comment on column public.study_plan_tasks.title is 'Brief title of the task';
comment on column public.study_plan_tasks.description is 'Detailed description of what to do';
comment on column public.study_plan_tasks.order_index is 'Order in which tasks should be completed (0-based)';
comment on column public.study_plan_tasks.estimated_time_minutes is 'Expected time to complete this task';
comment on column public.study_plan_tasks.is_completed is 'Whether the task has been completed';
comment on column public.study_plan_tasks.completed_at is 'Timestamp when the task was completed';
comment on column public.study_plan_tasks.task_type is 'Type of task: reading, practice, quiz, or review';
comment on column public.study_plan_tasks.resource_links is 'Optional array of URLs or references for this task';
