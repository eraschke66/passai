# 🌱 Garden System Integration - Implementation Plan

**Feature:** Garden Growth System Integration  
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 2-3 days  
**Current Status:** 30% complete (UI components exist, not integrated)

---

## 🎯 Goal

Transform the existing Garden UI components into a functional psychological engagement system that:

1. Celebrates quiz completion with visual garden growth
2. Tracks consistency through "Garden Health"
3. Replaces traditional gamification (badges/streaks) with nurturing metaphor
4. Encourages daily study through emotional connection to "growing garden"

---

## 📋 Prerequisites Checklist

Before starting implementation:

- [x] Garden UI components exist (`src/features/quizzes/components/garden/`)
- [x] Quiz completion flow works
- [x] Supabase client configured
- [ ] Database migration ready for `plant_states` table
- [ ] Understand garden emoticon system (🌳🌻🌿🌱💧)

---

## 🗄️ Phase 1: Database Schema (30 minutes)

### Task 1.1: Create `plant_states` Table

**File:** `supabase/schema_definitions/plant_states.sql`

**SQL to create:**

```sql
create table public.plant_states (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid not null,
  level integer not null default 1,
  points integer not null default 0,
  health integer not null default 100, -- 0-100 percentage
  last_tended_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint plant_states_pkey primary key (id),
  constraint plant_states_user_subject_unique unique (user_id, subject_id),
  constraint plant_states_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete cascade,
  constraint plant_states_subject_id_fkey foreign key (subject_id)
    references subjects (id) on delete cascade,
  constraint plant_states_level_check check (level >= 1 and level <= 100),
  constraint plant_states_points_check check (points >= 0),
  constraint plant_states_health_check check (health >= 0 and health <= 100)
) tablespace pg_default;

-- Indexes
create index plant_states_user_id_idx on public.plant_states using btree (user_id);
create index plant_states_subject_id_idx on public.plant_states using btree (subject_id);
create index plant_states_health_idx on public.plant_states using btree (health);

-- Updated_at trigger
create trigger plant_states_updated_at
before update on plant_states
for each row
execute function handle_updated_at();
```

**Validation:**

- [ ] Table created in Supabase
- [ ] RLS policies configured (user can only see their own plant states)
- [ ] Triggers working

---

## 🔧 Phase 2: Service Layer (1-2 hours)

### Task 2.1: Create Plant State Service

**File:** `src/features/quizzes/services/plantStateService.ts` (NEW)

**Functions to implement:**

```typescript
import { supabase } from "@/lib/supabase/client";

export interface PlantState {
  id: string;
  user_id: string;
  subject_id: string;
  level: number;
  points: number;
  health: number;
  last_tended_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get or create plant state for a subject
 */
export async function getPlantState(
  subjectId: string
): Promise<PlantState | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Try to get existing
  const { data, error } = await supabase
    .from("plant_states")
    .select("*")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching plant state:", error);
    return null;
  }

  // Create if doesn't exist
  if (!data) {
    const { data: newPlant, error: createError } = await supabase
      .from("plant_states")
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        level: 1,
        points: 0,
        health: 100,
        last_tended_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating plant state:", createError);
      return null;
    }

    return newPlant;
  }

  return data;
}

/**
 * Calculate points earned from quiz score
 */
export function calculatePointsEarned(
  score: number,
  totalQuestions: number
): number {
  // 10 points per correct answer
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  return correctAnswers * 10;
}

/**
 * Calculate new level from points
 */
export function calculateLevel(points: number): number {
  // Level up every 100 points
  return Math.floor(points / 100) + 1;
}

/**
 * Update plant state after quiz completion
 */
export async function updatePlantStateAfterQuiz(
  subjectId: string,
  quizScore: number,
  totalQuestions: number
): Promise<PlantState | null> {
  const plantState = await getPlantState(subjectId);
  if (!plantState) return null;

  const pointsEarned = calculatePointsEarned(quizScore, totalQuestions);
  const newPoints = plantState.points + pointsEarned;
  const newLevel = calculateLevel(newPoints);

  const { data, error } = await supabase
    .from("plant_states")
    .update({
      points: newPoints,
      level: newLevel,
      last_tended_at: new Date().toISOString(),
    })
    .eq("id", plantState.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating plant state:", error);
    return null;
  }

  return data;
}

/**
 * Calculate garden health based on study consistency
 */
export async function calculateGardenHealth(
  subjectId: string
): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  // Get study sessions from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: sessions, error } = await supabase
    .from("study_sessions")
    .select("started_at")
    .eq("user_id", user.id)
    .eq("subject_id", subjectId)
    .gte("started_at", sevenDaysAgo.toISOString());

  if (error || !sessions) return 0;

  // Count unique days studied
  const uniqueDays = new Set(
    sessions.map((s) => new Date(s.started_at).toDateString())
  );

  // Health = (days studied / 7) * 100
  return Math.round((uniqueDays.size / 7) * 100);
}

/**
 * Update garden health for a subject
 */
export async function updateGardenHealth(subjectId: string): Promise<void> {
  const health = await calculateGardenHealth(subjectId);
  const plantState = await getPlantState(subjectId);

  if (!plantState) return;

  await supabase
    .from("plant_states")
    .update({ health })
    .eq("id", plantState.id);
}

/**
 * Get garden emoticon based on health percentage
 */
export function getGardenEmoticon(health: number): string {
  if (health >= 85) return "🌳"; // Thriving
  if (health >= 70) return "🌻"; // Blooming
  if (health >= 55) return "🌿"; // Healthy
  if (health >= 40) return "🌱"; // Growing
  return "💧"; // Needs water
}

/**
 * Get garden status label
 */
export function getGardenStatusLabel(health: number): string {
  if (health >= 85) return "Thriving";
  if (health >= 70) return "Blooming";
  if (health >= 55) return "Healthy";
  if (health >= 40) return "Growing";
  return "Needs Tending";
}
```

**Validation:**

- [ ] All functions compile without errors
- [ ] Test `getPlantState` creates new plant if doesn't exist
- [ ] Test `calculatePointsEarned` returns correct points
- [ ] Test `updatePlantStateAfterQuiz` updates database

---

## 🎨 Phase 3: Quiz Results Integration (2-3 hours)

### Task 3.1: Update QuizResultsPage to Show Garden Teaser

**File:** `src/features/quizzes/components/quizresults/QuizResultsPage.tsx`

**Changes needed:**

1. **Import plant state service:**

```typescript
import {
  updatePlantStateAfterQuiz,
  calculatePointsEarned,
  getGardenEmoticon,
  type PlantState,
} from "../../services/plantStateService";
```

2. **Add state for plant data:**

```typescript
const [plantState, setPlantState] = useState<PlantState | null>(null);
const [pointsEarned, setPointsEarned] = useState(0);
const [showGarden, setShowGarden] = useState(false);
```

3. **Update plant state after quiz completion:**

```typescript
// In the effect that calculates results
useEffect(() => {
  if (attempt && questions.length > 0) {
    // ... existing result calculation code ...

    // NEW: Update plant state
    const updatePlant = async () => {
      const points = calculatePointsEarned(calculatedScore, questions.length);
      setPointsEarned(points);

      const updated = await updatePlantStateAfterQuiz(
        attempt.subject_id,
        calculatedScore,
        questions.length
      );

      if (updated) {
        setPlantState(updated);
      }
    };

    updatePlant();
  }
}, [attempt, questions]);
```

4. **Update the score celebration to include garden emoticon:**

```typescript
<div className="text-center mb-8">
  <div className="text-6xl mb-4">
    {getGardenEmoticon(plantState?.health || 0)}
  </div>
  <h2 className="text-3xl font-bold mb-2">{getScoreTitle(score)}</h2>
  <p className="text-xl text-slate-600">
    You scored {score}% ({correctCount}/{totalQuestions})
  </p>
</div>
```

5. **Show GardenTeaser component:**

```typescript
{
  /* Garden Growth Teaser - show if plant state loaded */
}
{
  plantState && (
    <GardenTeaser
      subject={subjectName}
      pointsEarned={pointsEarned}
      level={plantState.level}
      onViewGarden={() => setShowGarden(true)}
    />
  );
}
```

6. **Add GardenProgress modal:**

```typescript
{
  /* Garden Progress Modal */
}
{
  showGarden && plantState && (
    <GardenProgress
      subject={subjectName}
      subjectColor={subjectColor}
      level={plantState.level}
      progress={plantState.points % 100} // progress to next level
      pointsEarned={pointsEarned}
      plantHealth={plantState.health}
      onClose={() => setShowGarden(false)}
    />
  );
}
```

**Validation:**

- [ ] Garden teaser appears after quiz completion
- [ ] Points calculated correctly
- [ ] Garden emoticon matches health level
- [ ] Clicking "View Garden" opens modal
- [ ] Modal shows correct level, points, health

---

## 📊 Phase 4: Dashboard Integration (1-2 hours)

### Task 4.1: Add Garden Health to Dashboard

**File:** `src/features/dashboard/pages/DashboardPage.tsx`

**Changes needed:**

1. **Add garden health to stats grid:**

```typescript
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import {
  getPlantState,
  getGardenEmoticon,
  getGardenStatusLabel,
} from "@/features/quizzes/services/plantStateService";
import { Sprout } from "lucide-react";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data: subjects = [] } = useSubjects();
  const [overallGardenHealth, setOverallGardenHealth] = useState<number | null>(
    null
  );

  // Calculate overall garden health
  useEffect(() => {
    const fetchGardenHealth = async () => {
      if (subjects.length === 0) {
        setOverallGardenHealth(0);
        return;
      }

      const plantStates = await Promise.all(
        subjects.map((s) => getPlantState(s.id))
      );

      const validStates = plantStates.filter((p) => p !== null);
      if (validStates.length === 0) {
        setOverallGardenHealth(0);
        return;
      }

      const avgHealth =
        validStates.reduce((sum, p) => sum + p!.health, 0) / validStates.length;
      setOverallGardenHealth(Math.round(avgHealth));
    };

    fetchGardenHealth();
  }, [subjects]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ... existing welcome header ... */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ... existing stats cards ... */}

        {/* Garden Health Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Garden
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-slate-900">
              {overallGardenHealth !== null ? `${overallGardenHealth}%` : "--"}
            </p>
            <span className="text-2xl">
              {overallGardenHealth !== null
                ? getGardenEmoticon(overallGardenHealth)
                : "🌱"}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {overallGardenHealth !== null
              ? getGardenStatusLabel(overallGardenHealth)
              : "Start studying to grow your garden"}
          </p>
        </div>
      </div>

      {/* ... rest of dashboard ... */}
    </div>
  );
}
```

**Validation:**

- [ ] Garden Health card shows on dashboard
- [ ] Percentage calculated from all subjects
- [ ] Emoticon updates based on health
- [ ] Status label shows correctly

---

## 🎯 Phase 5: Subject Detail Page Integration (1 hour)

### Task 5.1: Add Garden Health to Subject Detail

**File:** `src/features/subjects/pages/SubjectDetailPage.tsx`

**Changes needed:**

1. **Add garden health card to stats:**

```typescript
import { useEffect, useState } from "react";
import {
  getPlantState,
  getGardenEmoticon,
  getGardenStatusLabel,
} from "@/features/quizzes/services/plantStateService";
import { Sprout } from "lucide-react";

export default function SubjectDetailPage() {
  // ... existing code ...
  const [gardenHealth, setGardenHealth] = useState<number | null>(null);

  // Fetch garden health
  useEffect(() => {
    const fetchHealth = async () => {
      if (!subject?.id) return;
      const plantState = await getPlantState(subject.id);
      setGardenHealth(plantState?.health || 0);
    };
    fetchHealth();
  }, [subject?.id]);

  return (
    <>
      {/* ... existing header ... */}

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        {/* ... existing Progress and Pass Chance cards ... */}

        {/* Garden Health */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Garden Health
            </span>
            <Sprout className="size-5 text-green-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-3xl font-bold text-gray-900">
              {gardenHealth !== null ? `${gardenHealth}%` : "--"}
            </div>
            <span className="text-2xl">
              {gardenHealth !== null ? getGardenEmoticon(gardenHealth) : "🌱"}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {gardenHealth !== null
              ? getGardenStatusLabel(gardenHealth)
              : "Complete quizzes to grow"}
          </p>
        </div>
      </div>

      {/* ... rest of page ... */}
    </>
  );
}
```

**Validation:**

- [ ] Garden Health card appears on subject detail page
- [ ] Shows health percentage and emoticon
- [ ] Updates when quiz is completed

---

## ✨ Phase 6: Garden Emoticon Consistency (1 hour)

### Task 6.1: Use Garden Emoticons Throughout App

**Files to update:**

- `src/components/ui/sonner.tsx` (toast notifications)
- `src/features/upload/pages/MaterialUploadPage.tsx` (success messages)
- `src/features/quizzes/components/quizresults/QuizResultsPage.tsx` (motivational messages)

**Emoticon system (from correspondence):**

```typescript
// Status/Progress Indicators
const STATUS_EMOTICONS = {
  thriving: "🌳", // 85%+
  blooming: "🌻", // 70-85%
  healthy: "🌿", // 55-70%
  growing: "🌱", // 40-55%
  needsWater: "💧", // <40%
};

// Actions/Feedback
const ACTION_EMOTICONS = {
  achievement: "🌻", // Success/Celebration
  tip: "🌺", // Learning Point/Info
  completed: "🎃", // Confirmation/Harvest
  focusArea: "🪴", // Needs Attention
  milestone: "💐", // Special Achievement
};
```

**Update toast messages:**

```typescript
// Example success toast
toast.success("Material uploaded! 🎃");

// Example quiz completion
toast.success("Quiz completed! Your garden grew! 🌻");

// Example weak area
toast.info("Focus on this topic 🪴");

// Example milestone
toast.success("You reached Level 5! 💐");
```

**Validation:**

- [ ] All success toasts use garden emoticons
- [ ] Quiz results use appropriate emoticons
- [ ] Upload confirmations use 🎃
- [ ] Info/tips use 🌺

---

## 🧪 Phase 7: Testing & Validation (2-3 hours)

### Task 7.1: Manual Testing Checklist

**Test Flow 1: First Quiz Completion**

- [ ] Create new subject
- [ ] Upload material
- [ ] Generate quiz
- [ ] Complete quiz with 80% score
- [ ] Verify plant_states record created
- [ ] Verify points = 80 (8 correct × 10 points)
- [ ] Verify level = 1
- [ ] Verify GardenTeaser appears
- [ ] Click "View Garden" button
- [ ] Verify GardenProgress modal shows
- [ ] Verify correct level, points, health displayed

**Test Flow 2: Multiple Quiz Completions**

- [ ] Complete 10 quizzes for same subject
- [ ] Verify points accumulate
- [ ] Verify level increases at 100, 200, 300 points
- [ ] Verify garden health updates

**Test Flow 3: Dashboard Display**

- [ ] Navigate to dashboard
- [ ] Verify Garden Health card shows
- [ ] Verify percentage is average of all subjects
- [ ] Verify emoticon matches health level

**Test Flow 4: Subject Detail Display**

- [ ] Navigate to subject detail page
- [ ] Verify Garden Health card shows
- [ ] Verify health percentage for that subject
- [ ] Complete quiz for subject
- [ ] Verify health updates

**Test Flow 5: Garden Health Calculation**

- [ ] Study 1 day this week → health = ~14%
- [ ] Study 3 days this week → health = ~43%
- [ ] Study 5 days this week → health = ~71%
- [ ] Study 7 days this week → health = 100%

### Task 7.2: Edge Cases

**Test Edge Cases:**

- [ ] User with no subjects (garden health shows 0%)
- [ ] Subject with no quizzes (garden health shows 0%)
- [ ] Perfect quiz score (100%) - verify points calculation
- [ ] Zero quiz score (0%) - verify 0 points given
- [ ] Level up during quiz (100 points → level 2)
- [ ] Database error handling (plant_states creation fails)

### Task 7.3: Cross-browser Testing

**Test on:**

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

---

## 🐛 Phase 8: Bug Fixes & Polish (1-2 hours)

### Task 8.1: Known Issues to Address

**Potential Issues:**

1. Garden modal too large on mobile

   - Add responsive breakpoints
   - Reduce padding on small screens

2. Animation timing feels off

   - Adjust delays in GardenProgress component

3. Points calculation edge cases

   - Handle decimal scores properly
   - Round to nearest integer

4. Loading states missing
   - Add skeleton loaders while fetching plant state

### Task 8.2: Performance Optimization

**Optimizations:**

- [ ] Cache plant state in React Query
- [ ] Avoid redundant database calls
- [ ] Lazy load GardenProgress modal
- [ ] Optimize garden health calculation query

---

## 📚 Phase 9: Documentation (30 minutes)

### Task 9.1: Update README

**Add to README.md:**

```markdown
## Garden System

PassAI uses a "Growth Garden" metaphor instead of traditional gamification:

- **Points**: Earned for correct quiz answers (10 points each)
- **Levels**: Automatically increase every 100 points
- **Garden Health**: Based on 7-day study consistency (0-100%)
- **Emoticons**: 🌳 (Thriving) → 🌻 (Blooming) → 🌿 (Healthy) → 🌱 (Growing) → 💧 (Needs Water)

### How It Works

1. Complete a quiz
2. Earn points for correct answers
3. Your garden grows (visual celebration)
4. Garden health reflects study consistency
5. Nurture your garden by studying regularly
```

### Task 9.2: Code Comments

**Add JSDoc comments to:**

- [ ] All service functions in `plantStateService.ts`
- [ ] Garden calculation logic
- [ ] Emoticon mapping functions

---

## ✅ Definition of Done

Garden System is **COMPLETE** when:

- [x] `plant_states` table exists in database
- [ ] Plant state created automatically for new subjects
- [ ] Points calculated correctly after quiz completion
- [ ] GardenTeaser appears after quiz completion
- [ ] GardenProgress modal opens and shows correct data
- [ ] Garden Health displayed on Dashboard
- [ ] Garden Health displayed on Subject Detail page
- [ ] Garden emoticons used consistently throughout app
- [ ] Garden health calculated from 7-day study consistency
- [ ] All manual tests pass
- [ ] All edge cases handled
- [ ] Mobile responsive
- [ ] Documentation updated

---

## 🚀 Next Steps After Completion

Once Garden System is complete, move to:

1. **BKT Integration** (Critical #2) - Connect Bayesian tracking to quizzes
2. **Teacher Layer** (Critical #3) - Use exam board in quiz generation
3. **Auto-Generate Quiz** (Critical #4) - Trigger after first upload

---

## 📞 Questions/Blockers

**Questions for clarification:**

- Should garden level be capped? (e.g., max level 100)
- Should points decay over time for inactivity?
- What happens if user deletes a subject? (cascade delete plant_states)
- Should we show garden for subjects with 0 quizzes? (currently shows 0%)

**Potential blockers:**

- Need OpenAI API key for testing quiz generation
- Need multiple test accounts for validation
- May need to seed database with test data

---

## 📝 Implementation Notes

**Code Style:**

- Use TypeScript strict mode
- Follow existing patterns in codebase
- Add error handling for all database calls
- Use toast notifications for user feedback
- Keep functions small and focused

**Git Commits:**

- Commit after each phase
- Use descriptive commit messages
- Example: "feat: add plant_states table and service"

**Testing Strategy:**

- Manual testing after each phase
- Test on mobile after phase 6
- Full regression test before marking complete

---

**Ready to start implementing? Let's begin with Phase 1: Database Schema! 🌱**
