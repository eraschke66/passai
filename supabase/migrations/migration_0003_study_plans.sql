-- =====================================================
-- MIGRATION: Study Plan & Analytics Feature
-- Version: 0003
-- Description: Creates all tables for study plans, mastery tracking, and analytics
-- Dependencies: Requires subjects, study_materials, and questions tables to exist
-- =====================================================

-- =====================================================
-- PART 1: Update existing questions table
-- =====================================================

-- Add the concept column for fine-grained BKT tracking
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

-- Create indexes on concept
create index if not exists idx_questions_concept 
  on public.questions using btree (concept) tablespace pg_default
  where (concept is not null);

create index if not exists idx_questions_topic_concept 
  on public.questions using btree (topic, concept) tablespace pg_default;

-- Backfill concept from topic for existing records
update public.questions
set concept = topic
where concept is null;

comment on column public.questions.concept is 'Fine-grained concept/skill being tested (more specific than topic) - used for BKT mastery tracking';

-- =====================================================
-- PART 2: Create study_plans table
-- =====================================================

create table public.study_plans (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  title text not null,
  description text null,
  generated_date timestamp with time zone not null default now(),
  start_date date not null,
  end_date date not null,
  total_hours integer not null,
  status text not null default 'active'::text,
  projected_pass_chance integer null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint study_plans_pkey primary key (id),
  constraint study_plans_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint study_plans_subject_id_fkey foreign key (subject_id) references subjects (id) on delete cascade,
  constraint study_plans_title_check check ((char_length(title) >= 1) and (char_length(title) <= 200)),
  constraint study_plans_description_check check ((description is null) or (char_length(description) <= 1000)),
  constraint study_plans_status_check check (status = any (array['active'::text, 'completed'::text, 'archived'::text])),
  constraint study_plans_total_hours_check check (total_hours > 0),
  constraint study_plans_date_range_check check (end_date >= start_date),
  constraint study_plans_projected_pass_chance_check check (
    (projected_pass_chance is null) or ((projected_pass_chance >= 0) and (projected_pass_chance <= 100))
  )
) tablespace pg_default;

-- Indexes for study_plans
create index if not exists idx_study_plans_user_id on public.study_plans using btree (user_id);
create index if not exists idx_study_plans_subject_id on public.study_plans using btree (subject_id);
create index if not exists idx_study_plans_status on public.study_plans using btree (status);
create index if not exists idx_study_plans_created_at on public.study_plans using btree (created_at desc);
create index if not exists idx_study_plans_user_subject on public.study_plans using btree (user_id, subject_id);
create index if not exists idx_study_plans_end_date on public.study_plans using btree (end_date) where (status = 'active'::text);

-- Trigger for study_plans
create trigger trigger_update_study_plans_updated_at before update on study_plans 
  for each row execute function update_updated_at ();

-- RLS for study_plans
alter table public.study_plans enable row level security;

create policy "Users can view their own study plans" on public.study_plans for select using (auth.uid() = user_id);
create policy "Users can create their own study plans" on public.study_plans for insert with check (auth.uid() = user_id);
create policy "Users can update their own study plans" on public.study_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own study plans" on public.study_plans for delete using (auth.uid() = user_id);

-- Comments for study_plans
comment on table public.study_plans is 'Stores AI-generated study plans for subjects with projected outcomes';
comment on column public.study_plans.title is 'The name/title of the study plan';
comment on column public.study_plans.projected_pass_chance is 'Predicted pass probability if plan is completed (0-100)';

-- =====================================================
-- PART 3: Create study_plan_topics table
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
  constraint study_plan_topics_study_plan_id_fkey foreign key (study_plan_id) references study_plans (id) on delete cascade,
  constraint study_plan_topics_plan_order_unique unique (study_plan_id, order_index),
  constraint study_plan_topics_title_check check ((char_length(title) >= 1) and (char_length(title) <= 200)),
  constraint study_plan_topics_description_check check ((description is null) or (char_length(description) <= 1000)),
  constraint study_plan_topics_order_index_check check (order_index >= 0),
  constraint study_plan_topics_total_time_minutes_check check (total_time_minutes > 0),
  constraint study_plan_topics_total_tasks_check check (total_tasks >= 0),
  constraint study_plan_topics_status_check check (status = any (array['not_started'::text, 'in_progress'::text, 'completed'::text])),
  constraint study_plan_topics_mastery_level_check check ((mastery_level is null) or ((mastery_level >= 0) and (mastery_level <= 100))),
  constraint study_plan_topics_priority_check check (priority = any (array['high'::text, 'medium'::text, 'low'::text]))
) tablespace pg_default;

-- Indexes for study_plan_topics
create index if not exists idx_study_plan_topics_study_plan_id on public.study_plan_topics using btree (study_plan_id);
create index if not exists idx_study_plan_topics_order on public.study_plan_topics using btree (study_plan_id, order_index);
create index if not exists idx_study_plan_topics_status on public.study_plan_topics using btree (status);
create index if not exists idx_study_plan_topics_priority on public.study_plan_topics using btree (priority);
create index if not exists idx_study_plan_topics_mastery_level on public.study_plan_topics using btree (mastery_level) where (mastery_level is not null);

-- Trigger for study_plan_topics
create trigger trigger_update_study_plan_topics_updated_at before update on study_plan_topics 
  for each row execute function update_updated_at ();

-- RLS for study_plan_topics
alter table public.study_plan_topics enable row level security;

create policy "Users can view their own study plan topics" on public.study_plan_topics for select 
  using (exists (select 1 from study_plans where study_plans.id = study_plan_topics.study_plan_id and study_plans.user_id = auth.uid()));

create policy "Users can create topics in their own study plans" on public.study_plan_topics for insert 
  with check (exists (select 1 from study_plans where study_plans.id = study_plan_topics.study_plan_id and study_plans.user_id = auth.uid()));

create policy "Users can update their own study plan topics" on public.study_plan_topics for update 
  using (exists (select 1 from study_plans where study_plans.id = study_plan_topics.study_plan_id and study_plans.user_id = auth.uid()))
  with check (exists (select 1 from study_plans where study_plans.id = study_plan_topics.study_plan_id and study_plans.user_id = auth.uid()));

create policy "Users can delete their own study plan topics" on public.study_plan_topics for delete 
  using (exists (select 1 from study_plans where study_plans.id = study_plan_topics.study_plan_id and study_plans.user_id = auth.uid()));

comment on table public.study_plan_topics is 'Topics or concepts within a study plan - displayed as accordion sections';

-- =====================================================
-- PART 4: Create study_plan_tasks table
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
  constraint study_plan_tasks_topic_id_fkey foreign key (topic_id) references study_plan_topics (id) on delete cascade,
  constraint study_plan_tasks_topic_order_unique unique (topic_id, order_index),
  constraint study_plan_tasks_title_check check ((char_length(title) >= 1) and (char_length(title) <= 200)),
  constraint study_plan_tasks_description_check check ((description is null) or (char_length(description) <= 1000)),
  constraint study_plan_tasks_order_index_check check (order_index >= 0),
  constraint study_plan_tasks_estimated_time_minutes_check check (estimated_time_minutes > 0),
  constraint study_plan_tasks_task_type_check check (task_type = any (array['reading'::text, 'practice'::text, 'quiz'::text, 'review'::text])),
  constraint study_plan_tasks_completed_at_check check ((not is_completed and completed_at is null) or (is_completed and completed_at is not null))
) tablespace pg_default;

-- Indexes for study_plan_tasks
create index if not exists idx_study_plan_tasks_topic_id on public.study_plan_tasks using btree (topic_id);
create index if not exists idx_study_plan_tasks_order on public.study_plan_tasks using btree (topic_id, order_index);
create index if not exists idx_study_plan_tasks_is_completed on public.study_plan_tasks using btree (is_completed);
create index if not exists idx_study_plan_tasks_task_type on public.study_plan_tasks using btree (task_type);
create index if not exists idx_study_plan_tasks_completed_at on public.study_plan_tasks using btree (completed_at desc) where (completed_at is not null);

-- Triggers for study_plan_tasks
create trigger trigger_update_study_plan_tasks_updated_at before update on study_plan_tasks 
  for each row execute function update_updated_at ();

-- Task completion handler trigger function
create or replace function handle_task_completion()
returns trigger as $$
begin
  if new.is_completed = true and old.is_completed = false then
    new.completed_at := now();
  end if;
  if new.is_completed = false and old.is_completed = true then
    new.completed_at := null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_handle_task_completion before update on study_plan_tasks
  for each row execute function handle_task_completion();

-- RLS for study_plan_tasks
alter table public.study_plan_tasks enable row level security;

create policy "Users can view their own study plan tasks" on public.study_plan_tasks for select 
  using (exists (select 1 from study_plan_topics join study_plans on study_plans.id = study_plan_topics.study_plan_id 
    where study_plan_topics.id = study_plan_tasks.topic_id and study_plans.user_id = auth.uid()));

create policy "Users can create tasks in their own study plan topics" on public.study_plan_tasks for insert 
  with check (exists (select 1 from study_plan_topics join study_plans on study_plans.id = study_plan_topics.study_plan_id 
    where study_plan_topics.id = study_plan_tasks.topic_id and study_plans.user_id = auth.uid()));

create policy "Users can update their own study plan tasks" on public.study_plan_tasks for update 
  using (exists (select 1 from study_plan_topics join study_plans on study_plans.id = study_plan_topics.study_plan_id 
    where study_plan_topics.id = study_plan_tasks.topic_id and study_plans.user_id = auth.uid()))
  with check (exists (select 1 from study_plan_topics join study_plans on study_plans.id = study_plan_topics.study_plan_id 
    where study_plan_topics.id = study_plan_tasks.topic_id and study_plans.user_id = auth.uid()));

create policy "Users can delete their own study plan tasks" on public.study_plan_tasks for delete 
  using (exists (select 1 from study_plan_topics join study_plans on study_plans.id = study_plan_topics.study_plan_id 
    where study_plan_topics.id = study_plan_tasks.topic_id and study_plans.user_id = auth.uid()));

comment on table public.study_plan_tasks is 'Individual action items within topics - displayed as checkable tasks';

-- =====================================================
-- PART 5: Create topic_mastery table
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
  p_learned real not null default 0.5,
  p_known real not null default 0.5,
  p_init real not null default 0.3,
  p_transit real not null default 0.1,
  p_guess real not null default 0.25,
  p_slip real not null default 0.1,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  constraint topic_mastery_pkey primary key (id),
  constraint topic_mastery_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint topic_mastery_subject_id_fkey foreign key (subject_id) references subjects (id) on delete cascade,
  constraint topic_mastery_user_subject_topic_unique unique (user_id, subject_id, topic_name),
  constraint topic_mastery_topic_name_check check ((char_length(topic_name) >= 1) and (char_length(topic_name) <= 200)),
  constraint topic_mastery_mastery_level_check check ((mastery_level >= 0) and (mastery_level <= 100)),
  constraint topic_mastery_correct_count_check check (correct_count >= 0),
  constraint topic_mastery_incorrect_count_check check (incorrect_count >= 0),
  constraint topic_mastery_total_attempts_check check (total_attempts >= 0 and total_attempts = (correct_count + incorrect_count)),
  constraint topic_mastery_p_learned_check check ((p_learned >= 0) and (p_learned <= 1)),
  constraint topic_mastery_p_known_check check ((p_known >= 0) and (p_known <= 1)),
  constraint topic_mastery_p_init_check check ((p_init >= 0) and (p_init <= 1)),
  constraint topic_mastery_p_transit_check check ((p_transit >= 0) and (p_transit <= 1)),
  constraint topic_mastery_p_guess_check check ((p_guess >= 0) and (p_guess <= 1)),
  constraint topic_mastery_p_slip_check check ((p_slip >= 0) and (p_slip <= 1))
) tablespace pg_default;

-- Indexes for topic_mastery
create index if not exists idx_topic_mastery_user_id on public.topic_mastery using btree (user_id);
create index if not exists idx_topic_mastery_subject_id on public.topic_mastery using btree (subject_id);
create index if not exists idx_topic_mastery_user_subject on public.topic_mastery using btree (user_id, subject_id);
create index if not exists idx_topic_mastery_topic_name on public.topic_mastery using btree (topic_name);
create index if not exists idx_topic_mastery_mastery_level on public.topic_mastery using btree (mastery_level);
create index if not exists idx_topic_mastery_last_practiced on public.topic_mastery using btree (last_practiced_at desc) where (last_practiced_at is not null);

-- Trigger for topic_mastery
create trigger trigger_update_topic_mastery_updated_at before update on topic_mastery 
  for each row execute function update_updated_at ();

-- RLS for topic_mastery
alter table public.topic_mastery enable row level security;

create policy "Users can view their own topic mastery" on public.topic_mastery for select using (auth.uid() = user_id);
create policy "Users can create their own topic mastery" on public.topic_mastery for insert with check (auth.uid() = user_id);
create policy "Users can update their own topic mastery" on public.topic_mastery for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own topic mastery" on public.topic_mastery for delete using (auth.uid() = user_id);

comment on table public.topic_mastery is 'Tracks learning progress and mastery for each topic using Bayesian Knowledge Tracing';

-- =====================================================
-- PART 6: Create material_coverage table
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
  constraint material_coverage_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint material_coverage_subject_id_fkey foreign key (subject_id) references subjects (id) on delete cascade,
  constraint material_coverage_material_id_fkey foreign key (material_id) references study_materials (id) on delete cascade,
  constraint material_coverage_user_material_unique unique (user_id, material_id),
  constraint material_coverage_coverage_percentage_check check ((coverage_percentage >= 0) and (coverage_percentage <= 100)),
  constraint material_coverage_time_spent_minutes_check check (time_spent_minutes >= 0),
  constraint material_coverage_notes_check check ((notes is null) or (char_length(notes) <= 2000))
) tablespace pg_default;

-- Indexes for material_coverage
create index if not exists idx_material_coverage_user_id on public.material_coverage using btree (user_id);
create index if not exists idx_material_coverage_subject_id on public.material_coverage using btree (subject_id);
create index if not exists idx_material_coverage_material_id on public.material_coverage using btree (material_id);
create index if not exists idx_material_coverage_user_subject on public.material_coverage using btree (user_id, subject_id);
create index if not exists idx_material_coverage_percentage on public.material_coverage using btree (coverage_percentage);
create index if not exists idx_material_coverage_last_accessed on public.material_coverage using btree (last_accessed_at desc) where (last_accessed_at is not null);

-- Trigger for material_coverage
create trigger trigger_update_material_coverage_updated_at before update on material_coverage 
  for each row execute function update_updated_at ();

-- RLS for material_coverage
alter table public.material_coverage enable row level security;

create policy "Users can view their own material coverage" on public.material_coverage for select using (auth.uid() = user_id);
create policy "Users can create their own material coverage" on public.material_coverage for insert with check (auth.uid() = user_id);
create policy "Users can update their own material coverage" on public.material_coverage for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own material coverage" on public.material_coverage for delete using (auth.uid() = user_id);

comment on table public.material_coverage is 'Tracks how much of each study material has been reviewed by the student';

-- =====================================================
-- PART 7: Create study_sessions table
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
  constraint study_sessions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint study_sessions_subject_id_fkey foreign key (subject_id) references subjects (id) on delete cascade,
  constraint study_sessions_duration_minutes_check check (duration_minutes > 0),
  constraint study_sessions_mood_check check ((mood is null) or (mood = any (array['confident'::text, 'okay'::text, 'struggling'::text, 'confused'::text]))),
  constraint study_sessions_notes_check check ((notes is null) or (char_length(notes) <= 2000)),
  constraint study_sessions_session_date_check check (session_date <= current_date)
) tablespace pg_default;

-- Indexes for study_sessions
create index if not exists idx_study_sessions_user_id on public.study_sessions using btree (user_id);
create index if not exists idx_study_sessions_subject_id on public.study_sessions using btree (subject_id);
create index if not exists idx_study_sessions_user_subject on public.study_sessions using btree (user_id, subject_id);
create index if not exists idx_study_sessions_session_date on public.study_sessions using btree (session_date desc);
create index if not exists idx_study_sessions_user_date on public.study_sessions using btree (user_id, session_date desc);
create index if not exists idx_study_sessions_mood on public.study_sessions using btree (mood) where (mood is not null);

-- Trigger for study_sessions
create trigger trigger_update_study_sessions_updated_at before update on study_sessions 
  for each row execute function update_updated_at ();

-- RLS for study_sessions
alter table public.study_sessions enable row level security;

create policy "Users can view their own study sessions" on public.study_sessions for select using (auth.uid() = user_id);
create policy "Users can create their own study sessions" on public.study_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own study sessions" on public.study_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own study sessions" on public.study_sessions for delete using (auth.uid() = user_id);

comment on table public.study_sessions is 'Logs individual study sessions for tracking consistency, streaks, and study patterns';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables for study plan and analytics feature have been created
-- Next steps: Create TypeScript types and service layer
