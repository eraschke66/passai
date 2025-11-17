# Onboarding Feature

## Overview

The onboarding feature provides a guided, interactive tour for new users when they first sign up. It introduces them to the platform's key features and helps them understand how to use PassAI effectively.

## Components

### OnboardingFlow

The main container component that manages the onboarding state and flow. It:

- Checks if the user has completed onboarding (stored in localStorage)
- Automatically triggers on first login
- Manages navigation between steps
- Handles skip and completion logic

### OnboardingModal

A beautiful modal component with:

- Progress bar showing current step
- Header with step counter and description
- Action buttons (Back, Skip, Next, Get Started)
- Responsive design
- Smooth animations

### OnboardingSteps

Five distinct steps that guide users:

1. **WelcomeStep** - Introduction to PassAI's key features

   - AI-powered quizzes
   - Study materials upload
   - Progress tracking
   - Subject management

2. **SubjectsStep** - How to add and manage subjects

   - Choosing subjects
   - Selecting exam boards
   - Setting target grades

3. **MaterialsStep** - Uploading study materials

   - Supported file formats
   - AI analysis explanation
   - Privacy information

4. **QuizzesStep** - Understanding the quiz system

   - Multiple choice questions
   - Short answer (AI-graded)
   - Essay questions (AI-graded)
   - Instant feedback

5. **ProgressStep** - Tracking improvement
   - Pass probability
   - Garden health
   - Smart insights

## Usage

The onboarding automatically appears for new users. To integrate into a page:

```tsx
import { OnboardingFlow } from "@/features/onboarding";

export default function YourPage() {
  return (
    <div>
      <OnboardingFlow />
      {/* Your page content */}
    </div>
  );
}
```

## Storage

Onboarding completion is tracked in localStorage:

- Key: `onboarding_completed_${user_id}`
- Value: `"true"` when completed or skipped

## Manual Reset

Users can reset their onboarding using the `useOnboarding` hook:

```tsx
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";

const { resetOnboarding } = useOnboarding();

// Call this to restart the onboarding
resetOnboarding();
```

## Design Features

- **Visual Hierarchy**: Clear step indicators and progress tracking
- **Color Coding**: Each feature area has its own color theme
- **Interactive**: Users can navigate back, skip, or proceed at their own pace
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessible**: Keyboard navigation and screen reader friendly
- **Smooth Animations**: Professional transitions between steps

## Future Enhancements

Potential improvements:

- Interactive tooltips on actual UI elements
- "Take a tour" button in settings
- Contextual help based on user actions
- Video walkthroughs for complex features
- Personalized tour based on user role (student vs teacher)
