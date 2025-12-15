create table public.quiz_materials (
  quiz_id uuid not null,
  material_id uuid not null,
  created_at timestamp with time zone not null default now(),
  constraint quiz_materials_pkey primary key (quiz_id, material_id),
  constraint quiz_materials_material_id_fkey foreign KEY (material_id) references study_materials (id) on delete CASCADE,
  constraint quiz_materials_quiz_id_fkey foreign KEY (quiz_id) references quizzes (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_quiz_materials_quiz_id on public.quiz_materials using btree (quiz_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_materials_material_id on public.quiz_materials using btree (material_id) TABLESPACE pg_default;