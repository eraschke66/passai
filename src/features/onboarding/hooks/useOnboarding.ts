import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { resetOnboardingStatus } from "../services/onboardingService";

export const useOnboarding = () => {
  const { profile } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const resetOnboarding = async () => {
    if (profile?.user_id) {
      try {
        await resetOnboardingStatus(profile.user_id);
        setIsOnboardingOpen(true);
      } catch (error) {
        console.error("Failed to reset onboarding:", error);
      }
    }
  };

  const hasCompletedOnboarding = () => {
    if (!profile) return false;
    // Check the onboarded field from the profile
    return profile.onboarded ?? false;
  };

  return {
    isOnboardingOpen,
    setIsOnboardingOpen,
    resetOnboarding,
    hasCompletedOnboarding: hasCompletedOnboarding(),
  };
};
