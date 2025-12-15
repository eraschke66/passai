create table public.quiz_attempts (
  id uuid not null default gen_random_uuid (),
  quiz_id uuid not null,
  user_id uuid not null,
  attempt_number integer not null,
  score integer not null,
  total_questions integer not null,
  correct_answers integer not null,
  completed_date timestamp with time zone not null default now(),
  time_spent integer not null,
  status text not null,
  mood text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint quiz_attempts_pkey primary key (id),
  constraint quiz_attempts_quiz_user_attempt_unique unique (quiz_id, user_id, attempt_number),
  constraint quiz_attempts_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE,
  constraint quiz_attempts_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint quiz_attempts_time_spent_check check ((time_spent >= 0)),
  constraint quiz_attempts_total_questions_check check ((total_questions >= 0)),
  constraint quiz_attempts_score_check check (
    (
      (score >= 0)
      and (score <= 100)
    )
  ),
  constraint quiz_attempts_check check (
    (
      (correct_answers >= 0)
      and (correct_answers <= total_questions)
    )
  ),
  constraint quiz_attempts_attempt_number_check check ((attempt_number > 0)),
  constraint quiz_attempts_status_check check (
    (
      status = any (array['completed'::text, 'in-progress'::text])
    )
  ),
  constraint quiz_attempts_mood_check check (
    (
      mood IS NULL OR mood = any (array['confident'::text, 'okay'::text, 'struggling'::text, 'confused'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_quiz_id on public.quiz_attempts using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_user_id on public.quiz_attempts using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_status on public.quiz_attempts using btree (status) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_completed_date on public.quiz_attempts using btree (completed_date desc) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_quiz_user on public.quiz_attempts using btree (quiz_id, user_id) TABLESPACE pg_default;

create trigger trigger_update_quiz_attempts_updated_at BEFORE
update on quiz_attempts for EACH row
execute FUNCTION update_updated_at ();