import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingModal } from "./OnboardingModal";
import {
  WelcomeStep,
  SubjectsStep,
  MaterialsStep,
  QuizzesStep,
  ProgressStep,
} from "./OnboardingSteps";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to PassAI",
    description: "Let's take a quick tour to get you started",
    component: WelcomeStep,
  },
  {
    id: "subjects",
    title: "Your Subjects",
    description: "Add the subjects you want to master",
    component: SubjectsStep,
  },
  {
    id: "materials",
    title: "Study Materials",
    description: "Upload your notes and textbooks",
    component: MaterialsStep,
  },
  {
    id: "quizzes",
    title: "AI-Powered Quizzes",
    description: "Practice with intelligent quizzes",
    component: QuizzesStep,
  },
  {
    id: "progress",
    title: "Track Your Progress",
    description: "Monitor your improvement over time",
    component: ProgressStep,
  },
];

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user needs onboarding
    const checkOnboardingStatus = async () => {
      if (!profile?.user_id) return;

      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(
        `onboarding_completed_${profile.user_id}`
      );

      if (!hasCompletedOnboarding) {
        // Small delay for better UX
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
      }
    };

    checkOnboardingStatus();
  }, [profile]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (profile?.user_id) {
      localStorage.setItem(`onboarding_completed_${profile.user_id}`, "true");
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    if (profile?.user_id) {
      localStorage.setItem(`onboarding_completed_${profile.user_id}`, "true");
    }
    setIsOpen(false);
  };

  const handleAddSubject = () => {
    handleClose();
    navigate("/subjects");
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const StepComponent = currentStepData.component;

  return (
    <OnboardingModal
      isOpen={isOpen}
      currentStep={currentStep}
      totalSteps={ONBOARDING_STEPS.length}
      title={currentStepData.title}
      description={currentStepData.description}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      onClose={handleClose}
      canGoNext={true}
      canGoPrev={currentStep > 0}
      isLastStep={currentStep === ONBOARDING_STEPS.length - 1}
      actionButton={
        currentStep === ONBOARDING_STEPS.length - 1
          ? {
              label: "Add Your First Subject",
              onClick: handleAddSubject,
            }
          : undefined
      }
    >
      <StepComponent />
    </OnboardingModal>
  );
};
