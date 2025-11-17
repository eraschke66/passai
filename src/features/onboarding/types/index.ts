export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  skipable?: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}
