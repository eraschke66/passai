create table public.questions (
  id uuid not null default gen_random_uuid (),
  quiz_id uuid not null,
  question text not null,
  type text not null,
  options text[] null,
  correct_answer text not null,
  explanation text null,
  topic text not null,
  difficulty text not null,
  source_snippet text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  points integer null,
  constraint questions_pkey primary key (id),
  constraint questions_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE,
  constraint questions_difficulty_check check (
    (
      difficulty = any (array['easy'::text, 'medium'::text, 'hard'::text])
    )
  ),
  constraint questions_topic_check check (
    (
      (char_length(topic) >= 1)
      and (char_length(topic) <= 255)
    )
  ),
  constraint questions_type_check check (
    (
      type = any (
        array[
          'multiple-choice'::text,
          'true-false'::text,
          'short-answer'::text,
          'matching'::text
        ]
      )
    )
  ),
  constraint questions_question_check check (
    (
      (char_length(question) >= 1)
      and (char_length(question) <= 1000)
    )
  ),
  constraint questions_explanation_check check (
    (
      (explanation is null)
      or (char_length(explanation) <= 2000)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_questions_topic on public.questions using btree (topic) TABLESPACE pg_default;

create index IF not exists idx_questions_quiz_id on public.questions using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_questions_type on public.questions using btree (type) TABLESPACE pg_default;

create index IF not exists idx_questions_difficulty on public.questions using btree (difficulty) TABLESPACE pg_default;

create index IF not exists idx_questions_created_at on public.questions using btree (created_at desc) TABLESPACE pg_default;

create trigger trigger_update_questions_updated_at BEFORE
update on questions for EACH row
execute FUNCTION update_updated_at ();