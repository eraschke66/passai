# Study Sessions Logging Implementation

**Date**: November 16, 2025  
**Status**: Implemented ✅  
**Priority**: High (Critical for Garden Health & Study Streak calculation)

## Problem Statement

The `study_sessions` table existed but wasn't being populated with student activity data. This meant:

- Garden health calculation had no data (always showing 0%)
- Study streaks couldn't be calculated
- `last_studied_at` on subjects wasn't being updated
- No analytics on student study patterns

## Solution Implemented

### 1. Created Study Session Logger Hook

**File**: `src/features/quizzes/hooks/useLogStudySession.ts`

**Purpose**: Centralized hook to log study sessions after quiz completion

**Features**:

- Logs entry to `study_sessions` table with:
  - Subject ID
  - Session date (today)
  - Duration in minutes (converted from seconds)
  - Mood (from quiz mood check)
  - Topics covered (optional)
  - Materials used (optional)
- Updates `subjects.last_studied_at` timestamp
- Invalidates relevant React Query caches (garden health, plant states, subjects)

**Usage**:

```typescript
const { mutate: logStudySession } = useLogStudySession();

logStudySession({
  subjectId: "uuid",
  durationMinutes: 15,
  mood: "confident",
  topicsCovered: ["Topic 1", "Topic 2"],
});
```

### 2. Integrated into Quiz Completion Flow

**File**: `src/features/quizzes/components/quizsession/QuizSession.tsx`

**Changes**:

- Imported `useLogStudySession` hook
- Called after successful quiz attempt completion
- Converts total time spent (seconds) to minutes
- Passes user mood from mood check modal

**Code**:

```typescript
onSuccess: () => {
  // Log study session for garden health calculation
  logStudySession({
    subjectId: props.subjectId,
    durationMinutes: Math.ceil(totalTimeSpent / 60),
    mood: userMood as
      | "confident"
      | "okay"
      | "struggling"
      | "confused"
      | undefined,
  });

  setIsQuizComplete(true);
};
```

### 3. Fixed Garden Health Calculation

**File**: `src/features/quizzes/services/plantStateService.ts`

**Bug Fixed**:

- Was querying `started_at` field (doesn't exist)
- Changed to query `session_date` field (actual schema)
- Changed date comparison to use YYYY-MM-DD format

**Before**:

```typescript
.select("started_at")
.gte("started_at", sevenDaysAgo.toISOString())
```

**After**:

```typescript
.select("session_date")
.gte("session_date", sevenDaysAgoStr) // YYYY-MM-DD format
```

**Health Calculation Logic**:

- Looks at last 7 days
- Counts unique days with study sessions
- Health = (days studied / 7) \* 100
- Example: Studied 5 out of 7 days = 71% health

### 4. Added Enhancement TODOs

**useSubjectAnalytics.ts**:

```typescript
totalStudyHours: 0, // TODO: Calculate from study_sessions table (sum duration_minutes / 60)
```

**useLogStudySession.ts**:

```typescript
// TODO: Enhance with quiz-specific data (quiz_id, questions_answered, etc.)
// TODO: Consider adding session_type field to differentiate quiz, review, material_study
// TODO: Track materials_used array when we have material study tracking
```

**QuizSession.tsx**:

```typescript
// TODO: Extract topics from quiz questions when topic tagging is implemented
// TODO: Track quiz_id reference when we add quiz_attempt_id to study_sessions
```

## Database Schema Reference

```sql
create table public.study_sessions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  subject_id uuid not null,
  session_date date not null,                    -- YYYY-MM-DD format
  duration_minutes integer not null,             -- Session length
  topics_covered text[] null,                    -- Array of topic names
  materials_used uuid[] null,                    -- Array of material IDs
  mood text null,                                -- confident|okay|struggling|confused
  notes text null,                               -- Optional student notes
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
```

## Data Flow

```
1. Student completes quiz
   └─> QuizSession.handleNextQuestion()
       └─> completeAttempt() mutation
           └─> onSuccess callback
               ├─> logStudySession() mutation
               │   ├─> createStudySession() - Insert to study_sessions table
               │   └─> updateLastStudied() - Update subjects.last_studied_at
               └─> setIsQuizComplete(true)

2. Garden Health Recalculation (automatic)
   └─> useGardenUpdate hook (on QuizResultsPage)
       └─> calculateGardenHealth(subjectId)
           └─> Query study_sessions for last 7 days
               └─> Count unique session_date values
                   └─> Return (unique_days / 7) * 100
```

## Testing Checklist

- [x] Hook compiles without TypeScript errors
- [x] Integration with QuizSession compiles successfully
- [x] Garden health query uses correct field name
- [ ] **Manual Test**: Complete a quiz and verify study_session record created
- [ ] **Manual Test**: Check subjects.last_studied_at is updated
- [ ] **Manual Test**: Complete quizzes on multiple days and verify garden health increases
- [ ] **Manual Test**: Skip a day and verify garden health decreases
- [ ] **Manual Test**: Check Dashboard garden health card shows updated health
- [ ] **Manual Test**: Check Subject Detail garden health card shows updated health

## Future Enhancements (TODOs)

### High Priority

1. **Quiz Reference Tracking**

   - Add `quiz_attempt_id` reference to study_sessions table
   - Link study sessions to specific quiz attempts
   - Enable "View quiz from session" navigation

2. **Topic Extraction**

   - Extract topics from quiz questions automatically
   - Populate `topics_covered` array in study sessions
   - Enable topic-specific study time analytics

3. **Session Type Differentiation**
   - Add `session_type` enum: "quiz", "review", "material_study", "practice"
   - Different point calculations per type
   - Better analytics segmentation

### Medium Priority

4. **Study Time Analytics**

   - Calculate total study hours from study_sessions
   - Show study time breakdown by topic
   - Display study time trends over weeks/months

5. **Material Usage Tracking**

   - Log which materials were used during study sessions
   - Track time spent per material
   - Show most/least used materials

6. **Streak Visualization**
   - Display current study streak on dashboard
   - Show streak calendar (GitHub-style contribution graph)
   - Celebrate streak milestones

### Low Priority

7. **Study Session Notes**

   - Allow students to add notes after quiz completion
   - Show notes in study history
   - Search notes by keyword

8. **Session Analytics Dashboard**

   - View all past study sessions
   - Filter by subject, date range, mood
   - Export study session data

9. **Mood-Based Insights**
   - Track mood patterns over time
   - Correlate mood with performance
   - Suggest study strategies based on mood trends

## Related Files

**Services**:

- `src/features/study-plan/services/study-sessions.service.ts` - CRUD operations
- `src/features/quizzes/services/plantStateService.ts` - Garden health calculation
- `src/features/subjects/services/subjectService.ts` - Update last_studied_at

**Hooks**:

- `src/features/quizzes/hooks/useLogStudySession.ts` - NEW: Log study sessions
- `src/features/quizzes/hooks/useGardenUpdate.ts` - Garden state updates
- `src/features/study-plan/hooks/useSubjectAnalytics.ts` - Subject analytics

**Components**:

- `src/features/quizzes/components/quizsession/QuizSession.tsx` - Quiz session flow
- `src/features/quizzes/components/quizresults/QuizResultsPage.tsx` - Quiz results
- `src/features/dashboard/pages/DashboardPage.tsx` - Dashboard with garden health
- `src/features/subjects/pages/SubjectDetailPage.tsx` - Subject detail with garden

**Database**:

- `supabase/schema_definitions/study_sessions.sql` - Table definition
- `supabase/schema_definitions/plant_states.sql` - Garden state table
- `supabase/schema_definitions/subjects.sql` - Subjects with last_studied_at

## Performance Considerations

**Query Optimization**:

- Study sessions query uses indexed fields:
  - `idx_study_sessions_user_id`
  - `idx_study_sessions_subject_id`
  - `idx_study_sessions_user_subject` (composite)
  - `idx_study_sessions_session_date` (desc for recent queries)

**Caching Strategy**:

- Study sessions cached for 5 minutes (staleTime)
- Garden health invalidated after session logging
- Subject queries invalidated after updates

**Rate Limiting**:

- Study session logging happens once per quiz completion
- No risk of excessive writes
- Consider batching if adding real-time study tracking

## Known Limitations

1. **No Material Study Tracking**: Currently only tracks quiz completions, not material reading/review
2. **No Real-Time Updates**: Health updates after quiz completion, not during active study
3. **No Session Editing**: Once logged, sessions can't be edited by students
4. **No Session Deletion**: Students can't remove incorrectly logged sessions
5. **Topic Coverage Manual**: Topics must be manually added, not auto-extracted from quiz

## Success Metrics

**Garden Health Accuracy**:

- Health should reflect actual study consistency
- 7 consecutive days of study = 100% health
- 0 days in last 7 days = 0% health

**Data Integrity**:

- One session per quiz completion
- `last_studied_at` always updated with sessions
- Session date never in the future
- Duration always positive

**User Experience**:

- Garden health updates immediately after quiz
- No perceptible delay from session logging
- Error handling doesn't block quiz completion

---

**Implementation Date**: November 16, 2025  
**Implemented By**: AI Assistant  
**Reviewed By**: Pending  
**Status**: Ready for Testing 🧪
