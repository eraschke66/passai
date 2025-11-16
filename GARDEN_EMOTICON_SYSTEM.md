# Garden Emoticon System

This document outlines the consistent garden-themed emoticon system used throughout PassAI to reinforce the psychological growth metaphor and replace traditional gamification elements.

## Core Garden Emoticons (Health-Based)

These emoticons represent the overall health and growth of a student's knowledge garden:

| Emoticon | Name           | Health Range | Context         | Message Tone                             |
| -------- | -------------- | ------------ | --------------- | ---------------------------------------- |
| 🌳       | **Tree**       | 85-100%      | Thriving garden | Mastery, excellence, consistent progress |
| 🌻       | **Sunflower**  | 70-84%       | Blooming garden | Strong progress, success, growth         |
| 🌿       | **Herb**       | 55-69%       | Healthy garden  | Steady growth, good effort               |
| 🌱       | **Seedling**   | 40-54%       | Growing garden  | Early stages, keep going, nurture        |
| 💧       | **Water Drop** | 0-39%        | Needs tending   | Requires care, needs attention           |

## Action Emoticons

Special emoticons for specific actions and events:

| Emoticon | Name             | Usage               | Context                                     |
| -------- | ---------------- | ------------------- | ------------------------------------------- |
| 🌻       | **Sunflower**    | Achievement/Success | Quiz completion, level up, celebration      |
| 🎃       | **Pumpkin**      | Completion/Harvest  | Material upload success, task completion    |
| 🪴       | **Potted Plant** | Focus/Planning      | Study plan generation, focusing on topics   |
| 💐       | **Bouquet**      | Milestone           | Major achievements, reaching level 10/20/50 |
| 🗑️       | **Trash**        | Deletion            | Material/content deletion                   |

## Implementation Map

### 1. Quiz Results Page

**File**: `src/features/quizzes/components/quizresults/QuizResultsPage.tsx`

```typescript
Score >= 90: "Outstanding! 🌳" - "Your garden is thriving! You've mastered this material!"
Score >= 75: "Great Job! 🌻" - "Your garden is blooming! Keep up the great work!"
Score >= 60: "Good Effort! 🌿" - "Your garden is growing! Keep practicing to improve!"
Score < 60:  "Keep Going! 🌱" - "Every seed starts small! Review and nurture your knowledge!"
```

### 2. Mood Check Modal

**File**: `src/features/quizzes/components/moodcheckmodal/MotivationalMessage.tsx`

```typescript
Confident: "Fantastic! Your garden is thriving! Keep that momentum going! 🌳";
Okay: "You're doing well! Keep nurturing your knowledge! 🌿";
Struggling: "That's okay! Every garden needs care. We'll adjust to help you succeed! 🌱";
Confused: "No worries! We'll provide more support to help your garden grow! 💧";
```

### 3. Current Performance (During Quiz)

**File**: `src/features/quizzes/components/moodcheckmodal/CurrentPerformance.tsx`

```typescript
Score >= 80: "Your garden is thriving! 🌳"
Score >= 60: "Your garden is growing strong! 🌿"
Score < 60:  "Keep nurturing your knowledge! 🌱"
```

### 4. Plant Health Display

**File**: `src/features/quizzes/components/garden/PlantHealth.tsx`

```typescript
Health >= 80: "Thriving! Keep up the consistent study! 🌳"
Health >= 60: "Blooming! Study regularly to maintain growth! 🌻"
Health >= 40: "Growing! Try to study more often! 🌿"
Health < 40:  "Needs tending! Your garden needs regular care! 💧"
```

### 5. Level Progress

**File**: `src/features/quizzes/components/garden/LevelProgress.tsx`

```typescript
Level Up Badge: "Level Up! 🌻"
Level Up Message: "🌻 Congratulations! Your garden has grown to the next level!"
```

### 6. Upload Success

**File**: `src/features/upload/components/UploadModal.tsx`

```typescript
Upload Success: "Material uploaded! 🎃"
```

### 7. Material Deletion

**File**: `src/features/upload/pages/MaterialUploadPage.tsx`

```typescript
Delete Success: "Material deleted 🗑️"
```

### 8. Quiz Generation

**File**: `src/features/quizzes/components/quizzcreationmodal/ScheduleOptions.tsx`

```typescript
Generation Success: "Quiz Generated Successfully! 🌻"
```

### 9. Study Plan Generation

**File**: `src/features/study/hooks/useGenerateStudyPlan.ts`

```typescript
Plan Success: "Study plan generated successfully! 🪴"
```

### 10. Garden Display Components

**Files**:

- `src/features/quizzes/components/garden/GardenHealthCard.tsx`
- `src/features/quizzes/components/garden/SubjectGardenCard.tsx`
- Dashboard and Subject Detail Pages

All display the appropriate health-based emoticon (🌳🌻🌿🌱💧) based on calculated health percentage.

## Design Principles

### 1. **Growth Over Competition**

- Emoticons emphasize personal growth and nurturing rather than winning/losing
- Messages focus on progress, care, and development
- No rankings, leaderboards, or competitive language

### 2. **Nature Metaphor Consistency**

- All messages use garden/plant-related language
- "Thriving", "blooming", "growing", "nurturing", "tending"
- Avoid generic success terms like "awesome", "crushing it", "nailed it"

### 3. **Positive Reinforcement at All Levels**

- Even low performance receives encouraging, growth-focused messages
- Water drop (💧) suggests need for care, not failure
- Seedling (🌱) represents beginnings, not inadequacy

### 4. **Emoticon Meaning Stability**

- Each emoticon has consistent meaning across the app
- 🌻 always means achievement/success
- 🎃 always means completion/harvest
- 🪴 always means focus/planning

### 5. **Action-Specific Emoticons**

- Generic success notifications use 🌻 (achievement)
- Completed tasks use 🎃 (harvest)
- Planning/focusing uses 🪴 (potted plant)
- Major milestones use 💐 (bouquet)

## Avoided Emoticons

These emoticons are **NOT** used as they conflict with the garden growth metaphor:

- 🏆 Trophy (competition/winning)
- ⭐ Star (generic success)
- 🎉 Party Popper (generic celebration)
- 🎊 Confetti Ball (generic celebration)
- 💪 Flexed Bicep (competition/strength)
- 🚀 Rocket (speed/rushing)
- 🔥 Fire (intensity/burnout)

## Testing Checklist

To ensure garden emoticon consistency:

- [ ] Complete a quiz with 90%+ score → See 🌳 on results page
- [ ] Complete a quiz with 75-89% score → See 🌻 on results page
- [ ] Complete a quiz with 60-74% score → See 🌿 on results page
- [ ] Complete a quiz with <60% score → See 🌱 on results page
- [ ] Upload a material → Toast shows 🎃
- [ ] Delete a material → Toast shows 🗑️
- [ ] Generate a quiz → Success message shows 🌻
- [ ] Generate a study plan → Success message shows 🪴
- [ ] Level up during quiz → See 🌻 in level up badge
- [ ] Check mood during quiz (confident) → See 🌳
- [ ] Check mood during quiz (struggling) → See 🌱
- [ ] View dashboard garden health → See health-based emoticon
- [ ] View subject detail garden health → See health-based emoticon

## Future Considerations

### Seasonal Variations (Optional)

Could add seasonal garden emoticons for special events:

- 🌸 Cherry Blossom - Spring milestones
- 🍂 Fallen Leaf - Autumn/review periods
- ❄️ Snowflake - Winter break study

### Animal Helpers (Optional)

Could introduce garden helper animals:

- 🐝 Bee - Busy study session
- 🦋 Butterfly - Transformation/major improvement
- 🐛 Caterpillar - Learning process

**Note**: Only add these if they enhance the metaphor without adding complexity.

## Code Reference

The emoticon mappings are defined in:

```typescript
// src/features/quizzes/services/plantStateService.ts

export const ACTION_EMOTICONS = {
  achievement: "🌻", // Success/Celebration
  tip: "🌺", // Helpful advice
  completed: "🎃", // Task completed
  focus: "🪴", // Focus on topic
  milestone: "💐", // Major achievement
} as const;

export function getGardenEmoticon(health: number): string {
  if (health >= 85) return "🌳"; // Thriving
  if (health >= 70) return "🌻"; // Blooming
  if (health >= 55) return "🌿"; // Healthy
  if (health >= 40) return "🌱"; // Growing
  return "💧"; // Needs tending
}
```

## Maintenance

When adding new features:

1. ✅ Check if the action/state fits an existing emoticon
2. ✅ Use health-based emoticons (🌳🌻🌿🌱💧) for progress/performance
3. ✅ Use action emoticons (🌻🎃🪴💐) for events/completions
4. ✅ Ensure messages use garden-related language
5. ✅ Update this document if new emoticons are added
6. ✅ Test consistency across related features

---

**Last Updated**: November 16, 2025
**Version**: 1.0
**Status**: Phase 6 Complete ✅
