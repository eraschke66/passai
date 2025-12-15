create table public.study_materials (
  id uuid not null default gen_random_uuid (),
  subject_id uuid not null,
  user_id uuid not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  storage_path text not null,
  thumbnail_url text null,
  text_content text null,
  processing_status text not null default 'pending'::text,
  error_message text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint study_materials_pkey primary key (id),
  constraint unique_storage_path unique (storage_path),
  constraint study_materials_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete CASCADE,
  constraint study_materials_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint study_materials_processing_status_check check (
    (
      processing_status = any (
        array[
          'pending'::text,
          'processing'::text,
          'ready'::text,
          'failed'::text
        ]
      )
    )
  ),
  constraint study_materials_file_type_check check (
    (
      file_type = any (
        array[
          'pdf'::text,
          'image'::text,
          'text'::text,
          'docx'::text,
          'pptx'::text
        ]
      )
    )
  ),
  constraint study_materials_file_size_check check ((file_size > 0))
) TABLESPACE pg_default;

create index IF not exists idx_study_materials_user_id on public.study_materials using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_study_materials_subject_id on public.study_materials using btree (subject_id) TABLESPACE pg_default;

create index IF not exists idx_study_materials_processing_status on public.study_materials using btree (processing_status) TABLESPACE pg_default;

create index IF not exists idx_study_materials_created_at on public.study_materials using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_study_materials_user_subject on public.study_materials using btree (user_id, subject_id) TABLESPACE pg_default;

create trigger trigger_update_study_materials_updated_at BEFORE
update on study_materials for EACH row
execute FUNCTION update_study_materials_updated_at ();