create table public.subjects (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  name text not null,
  description text null,
  test_date date null,
  exam_board text null,
  teacher_emphasis text null,
  icon text not null default 'book'::text,
  color text not null default 'blue'::text,
  progress integer null default 0,
  pass_chance integer null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  last_studied_at timestamp with time zone null,
  constraint subjects_pkey primary key (id),
  constraint subjects_user_id_name_key unique (user_id, name),
  constraint subjects_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint subjects_pass_chance_check check (
    (
      (pass_chance is null)
      or (
        (pass_chance >= 0)
        and (pass_chance <= 100)
      )
    )
  ),
  constraint subjects_description_check check (
    (
      (description is null)
      or (char_length(description) <= 500)
    )
  ),
  constraint subjects_teacher_emphasis_check check (
    (
      (teacher_emphasis is null)
      or (char_length(teacher_emphasis) <= 500)
    )
  ),
  constraint subjects_test_date_check check (
    (
      (test_date is null)
      or (test_date >= CURRENT_DATE)
    )
  ),
  constraint subjects_progress_check check (
    (
      (progress >= 0)
      and (progress <= 100)
    )
  ),
  constraint subjects_exam_board_check check (
    (
      (exam_board is null)
      or (char_length(exam_board) <= 100)
    )
  ),
  constraint subjects_name_check check (
    (
      (char_length(name) > 0)
      and (char_length(name) <= 100)
    )
  )
) TABLESPACE pg_default;

create index IF not exists subjects_user_id_idx on public.subjects using btree (user_id) TABLESPACE pg_default;

create index IF not exists subjects_test_date_idx on public.subjects using btree (test_date) TABLESPACE pg_default
where
  (test_date is not null);

create index IF not exists subjects_created_at_idx on public.subjects using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists subjects_progress_idx on public.subjects using btree (progress) TABLESPACE pg_default;

create index IF not exists subjects_user_test_date_idx on public.subjects using btree (user_id, test_date) TABLESPACE pg_default
where
  (test_date is not null);

create trigger subjects_updated_at BEFORE
update on subjects for EACH row
execute FUNCTION handle_subject_updated_at ();