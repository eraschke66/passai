import { supabase } from "@/lib/supabase/client";

/**
 * Mark user as having completed onboarding
 */
export const markOnboardingComplete = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarded: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating onboarding status:", error);
    throw error;
  }
};

/**
 * Reset onboarding status (for manually restarting the tour)
 */
export const resetOnboardingStatus = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarded: false })
    .eq("user_id", userId);

  if (error) {
    console.error("Error resetting onboarding status:", error);
    throw error;
  }
};

/**
 * Check if user has completed onboarding
 */
export const checkOnboardingStatus = async (
  userId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }

  return data?.onboarded ?? false;
};
