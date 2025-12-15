create table public.user_answers (
  id uuid not null default gen_random_uuid (),
  attempt_id uuid not null,
  question_id uuid not null,
  user_answer text null,
  is_correct boolean not null,
  time_spent integer not null,
  feedback text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_answers_pkey primary key (id),
  constraint user_answers_attempt_question_unique unique (attempt_id, question_id),
  constraint user_answers_attempt_id_fkey foreign KEY (attempt_id) references quiz_attempts (id) on delete CASCADE,
  constraint user_answers_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE,
  constraint user_answers_feedback_check check (
    (
      feedback = any (array['thumbs-up'::text, 'thumbs-down'::text])
    )
  ),
  constraint user_answers_time_spent_check check ((time_spent >= 0)),
  constraint user_answers_user_answer_check check (
    (
      (user_answer is null)
      or (char_length(user_answer) <= 1000)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_user_answers_attempt_id on public.user_answers using btree (attempt_id) TABLESPACE pg_default;

create index IF not exists idx_user_answers_question_id on public.user_answers using btree (question_id) TABLESPACE pg_default;

create index IF not exists idx_user_answers_is_correct on public.user_answers using btree (is_correct) TABLESPACE pg_default;

create index IF not exists idx_user_answers_created_at on public.user_answers using btree (created_at desc) TABLESPACE pg_default;

create trigger trigger_update_user_answers_updated_at BEFORE
update on user_answers for EACH row
execute FUNCTION update_updated_at ();