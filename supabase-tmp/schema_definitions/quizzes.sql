create table public.quizzes (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  title text not null,
  description text null,
  questions_count integer not null,
  duration integer not null,
  difficulty text not null,
  status text not null default 'not-started'::text,
  score integer null,
  completed_date timestamp with time zone null,
  due_date timestamp with time zone null,
  attempts integer not null default 0,
  best_score integer null,
  average_score integer null,
  topics_count integer not null default 0,
  created_date timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint quizzes_pkey primary key (id),
  constraint quizzes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint quizzes_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint quizzes_description_check check (
    (
      (description is null)
      or (char_length(description) <= 1000)
    )
  ),
  constraint quizzes_difficulty_check check (
    (
      difficulty = any (
        array[
          'easy'::text,
          'medium'::text,
          'hard'::text,
          'adaptive'::text
        ]
      )
    )
  ),
  constraint quizzes_due_date_check check (
    (
      (due_date is null)
      or (due_date >= now())
    )
  ),
  constraint quizzes_duration_check check ((duration >= 0)),
  constraint quizzes_average_score_check check (
    (
      (average_score is null)
      or (
        (average_score >= 0)
        and (average_score <= 100)
      )
    )
  ),
  constraint quizzes_questions_count_check check ((questions_count >= 0)),
  constraint quizzes_score_check check (
    (
      (score is null)
      or (
        (score >= 0)
        and (score <= 100)
      )
    )
  ),
  constraint quizzes_status_check check (
    (
      status = any (
        array[
          'completed'::text,
          'in-progress'::text,
          'not-started'::text
        ]
      )
    )
  ),
  constraint quizzes_attempts_check check ((attempts >= 0)),
  constraint quizzes_title_check check (
    (
      (char_length(title) >= 1)
      and (char_length(title) <= 255)
    )
  ),
  constraint quizzes_topics_count_check check ((topics_count >= 0)),
  constraint quizzes_best_score_check check (
    (
      (best_score is null)
      or (
        (best_score >= 0)
        and (best_score <= 100)
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_quizzes_user_id on public.quizzes using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quizzes_subject_id on public.quizzes using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_quizzes_status on public.quizzes using btree (status) TABLESPACE pg_default;

create index IF not exists idx_quizzes_created_at on public.quizzes using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_quizzes_due_date on public.quizzes using btree (due_date) TABLESPACE pg_default
where
  (due_date is not null);

create index IF not exists idx_quizzes_user_subject on public.quizzes using btree (user_id, subject_id) TABLESPACE pg_default;

create trigger trigger_update_quizzes_updated_at BEFORE
update on quizzes for EACH row
execute FUNCTION update_updated_at ();