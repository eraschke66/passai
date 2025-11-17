import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useOnboarding = () => {
  const { profile } = useAuth();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const resetOnboarding = () => {
    if (profile?.user_id) {
      localStorage.removeItem(`onboarding_completed_${profile.user_id}`);
      setIsOnboardingOpen(true);
    }
  };

  const hasCompletedOnboarding = () => {
    if (!profile?.user_id) return false;
    return (
      localStorage.getItem(`onboarding_completed_${profile.user_id}`) === "true"
    );
  };

  return {
    isOnboardingOpen,
    setIsOnboardingOpen,
    resetOnboarding,
    hasCompletedOnboarding: hasCompletedOnboarding(),
  };
};
