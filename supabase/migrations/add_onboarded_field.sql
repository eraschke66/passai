-- Add onboarded column to profiles table
-- This tracks whether a user has completed the onboarding tour

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarded BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.onboarded IS 'Tracks whether user has completed the onboarding tour';

-- Create index for faster queries (optional, but useful if we query by this often)
CREATE INDEX IF NOT EXISTS profiles_onboarded_idx ON public.profiles USING btree (onboarded);
