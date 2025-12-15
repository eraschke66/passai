create table public.profiles (
  id uuid not null,
  email text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  subscription_tier text not null default 'free'::text,
  subscription_status text not null default 'active'::text,
  user_id uuid null,
  onboarded boolean not null default false,
  constraint profiles_pkey primary key (email),
  constraint profiles_email_key unique (email),
  constraint profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE,
  constraint profiles_subscription_status_check check (
    (
      subscription_status = any (
        array[
          'active'::text,
          'inactive'::text,
          'cancelled'::text
        ]
      )
    )
  ),
  constraint profiles_subscription_tier_check check (
    (
      subscription_tier = any (array['free'::text, 'premium'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists profiles_email_idx on public.profiles using btree (email) TABLESPACE pg_default;

create index IF not exists profiles_subscription_tier_idx on public.profiles using btree (subscription_tier) TABLESPACE pg_default;

create index IF not exists profiles_onboarded_idx on public.profiles using btree (onboarded) TABLESPACE pg_default;

create trigger profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION handle_updated_at ();