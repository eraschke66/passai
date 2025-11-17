# PassAI Feature Roadmap & Implementation Plan

**Last Updated:** November 16, 2025  
**Current Status:** Phase 1 - 60-70% Complete

---

## 🎯 Priority Legend

- 🔴 **CRITICAL** - Core differentiators, must-have for MVP
- 🟡 **HIGH** - Important for complete Phase 1 experience
- 🟢 **MEDIUM** - Enhances user experience, Phase 1.5
- 🔵 **LOW** - Nice to have, Phase 2+

---

## 📊 Feature Status Categories

- ✅ **COMPLETE** - Fully functional and tested
- 🟧 **HALF-BAKED** - Exists but not integrated/functional
- 🟥 **NOT STARTED** - Needs implementation
- ⚠️ **NEEDS REFINEMENT** - Works but needs improvements

---

## 🔴 CRITICAL PRIORITY (Start Here)

### 1. Garden Growth System Integration 🟧

**Status:** Components exist but not integrated  
**Completion:** 30%  
**Files Affected:**

- `src/features/quizzes/components/garden/GardenProgress.tsx` ✅
- `src/features/quizzes/components/garden/GardenTeaser.tsx` ✅
- `src/features/quizzes/components/quizresults/QuizResultsPage.tsx` 🟧
- `src/features/subjects/pages/SubjectDetailPage.tsx` ⚠️
- `src/features/dashboard/pages/DashboardPage.tsx` ⚠️

**What's Done:**

- ✅ Garden components built (GardenProgress, GardenTeaser, PlantVisualization)
- ✅ UI design complete
- ✅ Animation logic ready

**What's Missing:**

- 🟥 Garden celebration not triggered after quiz completion
- 🟥 Garden Health not displayed on dashboard
- 🟥 No database tracking for plant_states table
- 🟥 Garden emoticons (🌳🌻🌿🌱💧) not used consistently in UI
- 🟥 No points/level system calculation

**Implementation Steps:**

1. Create `plant_states` table in Supabase

   ```sql
   - subject_id (FK to subjects)
   - level (integer)
   - points (integer)
   - health (0-100)
   - last_tended_at (timestamp)
   ```

2. Trigger GardenProgress modal after quiz completion

   - Update `QuizResultsPage.tsx` to show garden teaser
   - Calculate points earned based on quiz score
   - Update plant health based on consistency

3. Display Garden Health on SubjectDetailPage

   - Add Garden Health card
   - Show garden emoticon based on health percentage

4. Add Garden Health widget to Dashboard
   - Show overall garden health across subjects
   - Use emoticons consistently

**Estimated Time:** 2-3 days

---

### 2. Bayesian Knowledge Tracking (BKT) Integration ✅

**Status:** Phase 1 Complete (95%)  
**Completion:** 95%  
**Completed:** November 17, 2025  
**Files Affected:**

- `src/features/study/utils/bkt.ts` ✅
- `src/features/study/services/mastery.service.ts` ✅
- `src/features/study/types/analytics.types.ts` ✅
- `src/features/study/components/PassProbabilityCard.tsx` ✅
- `src/features/study/components/TopicMasteryCard.tsx` ✅
- `src/features/study/components/WeakAreasCard.tsx` ✅
- `src/features/study/hooks/useMastery.ts` ✅
- `src/features/quizzes/services/quizzesService.ts` ✅
- `src/features/quizzes/lib/quizGen.ts` ✅
- `supabase/schema_definitions/topic_mastery.sql` ✅

**What's Done:**

- ✅ BKT algorithm migrated to study/ folder (active)
- ✅ Concept field added to quiz generation
- ✅ Mastery updates after quiz completion
- ✅ Pass probability calculated from BKT
- ✅ PassProbabilityCard (Subject Detail + Dashboard)
- ✅ TopicMasteryCard (detailed breakdown with progress bars)
- ✅ WeakAreasCard (priority-based weak areas)
- ✅ Data flow: Quiz → Concept → BKT → Pass Probability → UI

**Future Enhancements (Backlog):**

See `completed_md/BKT_FUTURE_ENHANCEMENTS.md` for:

- Historical mastery tracking (graphs over time)
- Adaptive difficulty (adjust based on mastery)
- Mastery decay (spaced repetition)
- Custom BKT parameters per subject
- Multi-concept questions
- Bayesian network visualization

**Time Spent:** 3 days

---

### 3. Teacher Layer Quiz Generation ⚠️

**Status:** Database fields exist but not used in quiz generation  
**Completion:** 30%  
**Files Affected:**

- `supabase/schema_definitions/subjects.sql` ✅ (fields exist)
- `src/features/subjects/types/subject.types.ts` ✅
- `src/features/quizzes/services/quizGenerationService.ts` ⚠️
- `src/features/subjects/components/SubjectForm.tsx` ⚠️

**What's Done:**

- ✅ `exam_board` field in subjects table
- ✅ `teacher_emphasis` field in subjects table
- ✅ Subject form can input teacher info

**What's Missing:**

- 🟥 `question_style` field not in schema (multiple_choice, short_answer, essay, mixed)
- 🟥 `grading_rubric` field not in schema
- 🟥 Quiz generation doesn't use exam_board in prompts
- 🟥 Quiz generation doesn't use teacher_emphasis in prompts
- 🟥 Questions not "curriculum-aligned"

**Implementation Steps:**

1. Add missing fields to subjects table

   ```sql
   ALTER TABLE subjects
   ADD COLUMN question_style TEXT,
   ADD COLUMN grading_rubric TEXT;
   ```

2. Update SubjectForm to collect:

   - Question style (dropdown: multiple_choice, short_answer, essay, mixed)
   - Teacher name (optional)
   - Grading rubric (optional textarea)

3. Update quiz generation prompts

   ```typescript
   const systemPrompt = `
   You are generating quiz questions for a ${exam_board} ${subjectName} exam.
   
   Question Style: ${question_style}
   Teacher Emphasis: ${teacher_emphasis}
   
   Generate questions that:
   - Match the ${exam_board} curriculum standards
   - Use ${question_style} format
   - Focus on: ${teacher_emphasis}
   - Use terminology common in ${exam_board} exams
   `;
   ```

4. Test with different exam boards (IB, AP, A-Level, GCSE)

**Estimated Time:** 2-3 days

---

### 4. Auto-Generate Quiz After Upload 🟥

**Status:** Not implemented  
**Completion:** 0%  
**Files Affected:**

- `src/features/upload/hooks/useMaterialUpload.ts` ⚠️
- `src/features/upload/pages/MaterialUploadPage.tsx` ⚠️
- `src/features/quizzes/components/quizzcreationmodal/CreateQuizFlow.tsx` ✅

**What's Missing:**

- 🟥 No detection of "first upload" for a subject
- 🟥 No auto-quiz generation after first upload
- 🟥 No "gentle nudge" notification after subsequent uploads
- 🟥 No edge function to handle auto-generation

**Implementation Steps:**

1. Detect first upload

   ```typescript
   // After successful upload
   const { count } = await supabase
     .from("study_materials")
     .select("id", { count: "exact", head: true })
     .eq("subject_id", subjectId);

   const isFirstUpload = (count ?? 0) === 1;
   ```

2. Auto-generate quiz for first upload

   ```typescript
   if (isFirstUpload) {
     // Show loading state
     toast.loading("Generating your first quiz...");

     // Generate quiz
     const quiz = await generateQuiz(subjectId, {
       difficulty: "mixed",
       questionCount: 10,
     });

     // Show success + redirect
     toast.success("🌻 Your first quiz is ready!");
     navigate(`/quizzes/${quiz.id}`);
   }
   ```

3. Gentle nudge for subsequent uploads
   ```typescript
   else {
     toast.success('Material uploaded! 🎃', {
       action: {
         label: 'Generate Quiz',
         onClick: () => navigate('/quizzes?action=create')
       }
     });
   }
   ```

**Estimated Time:** 1-2 days

---

## 🟡 HIGH PRIORITY (Next Sprint)

### 5. UX Flow Simplification ⚠️

**Status:** Needs major restructuring  
**Completion:** 40%  
**Files Affected:**

- `src/features/dashboard/pages/DashboardPage.tsx` ⚠️
- `src/components/layout/DashboardLayout.tsx` ⚠️
- `src/App.tsx` ✅

**Current Issues:**

- ⚠️ Too much navigation required
- ⚠️ No clear "next action" on dashboard
- ⚠️ User must think about where to go

**Goal:** Duolingo-style guided experience

**Implementation Steps:**

1. Dashboard becomes "mission control"

   - Show "Next Action" card prominently
   - If no materials: "Upload materials for [Subject]"
   - If materials but no quiz: "Take your first quiz"
   - If quiz taken: "Continue learning" or "Review weak areas"

2. Add quick action buttons

   ```tsx
   <Card>
     <h2>What's Next?</h2>
     {!hasMaterials && (
       <Button onClick={() => navigate("/upload")}>
         Upload Study Materials 📚
       </Button>
     )}
     {hasMaterials && !hasQuiz && (
       <Button onClick={generateQuiz}>Generate Your First Quiz 🎯</Button>
     )}
     {hasQuiz && (
       <Button onClick={() => navigate(`/quizzes/${latestQuiz.id}`)}>
         Continue Learning 🌱
       </Button>
     )}
   </Card>
   ```

3. Reduce navigation depth

   - Merge subject detail into dashboard cards
   - Add inline upload from subject cards
   - Add inline quiz generation

4. Add progress indicators everywhere
   - Show garden health on every page
   - Show pass probability on every page
   - Show days until test countdown

**Estimated Time:** 3-4 days

---

### 6. Study Time Tracking 🟥

**Status:** Not started (study_sessions table exists)  
**Completion:** 0%  
**Files Affected:**

- `supabase/schema_definitions/study_sessions.sql` ✅
- `src/features/quizzes/pages/QuizSessionPage.tsx` ⚠️
- `src/features/study/services/studySessionService.ts` 🟥

**What's Done:**

- ✅ `study_sessions` table exists

**What's Missing:**

- 🟥 No time tracking during quiz sessions
- 🟥 No daily study time calculation
- 🟥 No 7-day consistency tracking
- 🟥 Garden health not updated based on consistency

**Implementation Steps:**

1. Create study session service

   ```typescript
   // Start session
   async function startStudySession(subjectId: string, activity: string) {
     return await supabase
       .from("study_sessions")
       .insert({
         subject_id: subjectId,
         activity,
         started_at: new Date().toISOString(),
       })
       .select()
       .single();
   }

   // End session
   async function endStudySession(sessionId: string) {
     const duration = calculateDuration();
     return await supabase
       .from("study_sessions")
       .update({
         ended_at: new Date().toISOString(),
         duration_minutes: duration,
       })
       .eq("id", sessionId);
   }
   ```

2. Track time in quiz sessions

   - Start session when quiz begins
   - End session when quiz completes
   - Store duration in database

3. Calculate garden health

   ```typescript
   // Get last 7 days of study
   const sessions = await getRecentStudySessions(subjectId, 7);
   const daysStudied = new Set(
     sessions.map((s) => new Date(s.started_at).toDateString())
   ).size;

   const health = (daysStudied / 7) * 100;
   ```

4. Display on dashboard
   - "Studied X days this week" 🌱
   - Garden health bar
   - Motivational message

**Estimated Time:** 2-3 days

---

### 7. Voice Recording Upload 🟥

**Status:** Not started (explicitly requested in correspondence)  
**Completion:** 0%  
**Files Affected:**

- `src/features/upload/pages/MaterialUploadPage.tsx` ⚠️
- `src/features/upload/components/VoiceRecorder.tsx` 🟥

**What's Missing:**

- 🟥 No MediaRecorder integration
- 🟥 No audio recording UI
- 🟥 No Whisper API transcription
- 🟥 No storage for audio files

**Implementation Steps:**

1. Create VoiceRecorder component

   ```tsx
   function VoiceRecorder({ onRecordingComplete }) {
     const [isRecording, setIsRecording] = useState(false);
     const [audioBlob, setAudioBlob] = useState(null);
     const mediaRecorderRef = useRef(null);

     async function startRecording() {
       const stream = await navigator.mediaDevices.getUserMedia({
         audio: true,
       });
       const recorder = new MediaRecorder(stream);
       // ... recording logic
     }
   }
   ```

2. Add to UploadMaterials page

   ```tsx
   <Card>
     <h3>Or Record Class Lecture</h3>
     <VoiceRecorder onRecordingComplete={handleVoiceUpload} />
     <p>
       🌺 Record your teacher's lecture and we'll transcribe it automatically
     </p>
   </Card>
   ```

3. Integrate Whisper API

   ```typescript
   async function transcribeAudio(audioBlob: Blob) {
     const formData = new FormData();
     formData.append("file", audioBlob, "recording.webm");
     formData.append("model", "whisper-1");

     const response = await fetch(
       "https://api.openai.com/v1/audio/transcriptions",
       { method: "POST", body: formData }
     );

     return await response.json();
   }
   ```

4. Store audio + transcription
   - Upload audio to Supabase Storage
   - Store transcription in study_materials
   - Link to subject

**Estimated Time:** 2-3 days

---

### 8. Quick Stats (Make Functional) ⚠️

**Status:** UI exists but shows static data  
**Completion:** 30%  
**Files Affected:**

- `src/features/dashboard/pages/DashboardPage.tsx` ⚠️
- `src/features/subjects/pages/SubjectDetailPage.tsx` ⚠️

**What's Done:**

- ✅ UI cards exist
- ✅ Icons and layout

**What's Missing:**

- 🟥 Days until test shows "0" (should calculate from test_date)
- 🟥 Daily study time shows "--" (should calculate from study_sessions)
- 🟥 Quiz progress shows "0/0" (should count completed quizzes)
- 🟥 Average score shows "--%" (should calculate from quiz attempts)

**Implementation Steps:**

1. Calculate days until test

   ```typescript
   const daysUntilTest = subject.test_date
     ? Math.ceil(
         (new Date(subject.test_date).getTime() - Date.now()) /
           (1000 * 60 * 60 * 24)
       )
     : null;
   ```

2. Calculate daily study time

   ```typescript
   const todaySessions = await getStudySessionsToday();
   const totalMinutes = todaySessions.reduce(
     (sum, s) => sum + s.duration_minutes,
     0
   );
   const hoursToday = Math.round((totalMinutes / 60) * 10) / 10; // 2.5h
   ```

3. Calculate quiz progress

   ```typescript
   const { count: totalQuizzes } = await supabase
     .from("quizzes")
     .select("id", { count: "exact", head: true })
     .eq("subject_id", subjectId);

   const { count: completedQuizzes } = await supabase
     .from("quiz_attempts")
     .select("id", { count: "exact", head: true })
     .eq("quiz_id", quizIds)
     .eq("status", "completed");
   ```

4. Calculate average score
   ```typescript
   const attempts = await getCompletedQuizAttempts(subjectId);
   const avgScore =
     attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
   ```

**Estimated Time:** 1-2 days

---

## 🟢 MEDIUM PRIORITY (Phase 1.5)

### 9. Quiz Results Enhancement ⚠️

**Status:** Basic results shown, needs more detail  
**Completion:** 60%  
**Files Affected:**

- `src/features/quizzes/components/quizresults/QuizResultsPage.tsx` ⚠️

**What's Done:**

- ✅ Score display
- ✅ Performance summary
- ✅ Garden teaser component

**What's Missing:**

- 🟥 Garden celebration not triggered
- 🟥 Weak areas not identified by concept
- 🟥 No "Review Answers" functionality
- 🟥 No source material linking
- 🟥 Motivational messages not personalized

**Implementation Steps:**

1. Trigger garden celebration

   - Calculate points earned (10 per correct answer)
   - Show GardenProgress modal
   - Update plant_states in database

2. Identify weak concepts

   ```typescript
   const weakConcepts = results
     .filter((r) => !r.isCorrect)
     .map((r) => r.question.concept)
     .reduce((acc, concept) => {
       acc[concept] = (acc[concept] || 0) + 1;
       return acc;
     }, {});

   const sorted = Object.entries(weakConcepts)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 3);
   ```

3. Add Review Answers mode

   - Show all questions with user's answers
   - Highlight correct/incorrect
   - Show explanations
   - Link to source material snippet

4. Personalize motivational messages
   ```typescript
   const messages = {
     high: ["Your garden is thriving! 🌳", "Excellent work!"],
     medium: ["You're growing steadily! 🌿", "Keep it up!"],
     low: ["Your garden needs some water 💧", "Let's review together"],
   };
   ```

**Estimated Time:** 2 days

---

### 10. Material Coverage Tracking 🟥

**Status:** Table exists but not used  
**Completion:** 10%  
**Files Affected:**

- `supabase/schema_definitions/material_coverage.sql` ✅
- `src/features/upload/services/materialService.ts` ⚠️

**What's Done:**

- ✅ `material_coverage` table exists

**What's Missing:**

- 🟥 Materials not linked to quizzes
- 🟥 No tracking of which material was tested
- 🟥 No "coverage percentage" calculation
- 🟥 No visual indicator of what's been covered

**Implementation Steps:**

1. Link materials to quiz questions

   - When generating quiz, note source material
   - Store in material_coverage table

2. Calculate coverage percentage

   ```typescript
   const totalMaterials = await getMaterialCount(subjectId);
   const coveredMaterials = await getCoveredMaterialCount(subjectId);
   const coveragePercent = (coveredMaterials / totalMaterials) * 100;
   ```

3. Display on subject page
   - "75% of materials covered" progress bar
   - List uncovered materials
   - "Generate quiz from uncovered materials" button

**Estimated Time:** 2 days

---

### 11. Skill Extraction from Materials 🟥

**Status:** Not started  
**Completion:** 0%  
**Files Affected:**

- `src/features/upload/hooks/useMaterialUpload.ts` ⚠️
- `src/lib/ai/openai.ts` ✅

**What's Missing:**

- 🟥 No AI extraction of skills from uploaded materials
- 🟥 No predefined skill templates for exam boards
- 🟥 Skills not auto-populated when subject is created

**Implementation Steps:**

1. Create skill templates

   ```typescript
   const SKILL_TEMPLATES = {
     IB: {
       English: [
         "Literary Analysis",
         "Essay Structure",
         "Character Development",
       ],
       Chemistry: ["Stoichiometry", "Gas Laws", "Thermodynamics"],
     },
     AP: {
       /* ... */
     },
   };
   ```

2. Auto-populate skills on subject creation

   ```typescript
   const template = SKILL_TEMPLATES[exam_board]?.[subject_name];
   if (template) {
     for (const skill of template) {
       await supabase.from("topic_mastery").insert({
         subject_id: subjectId,
         topic_name: skill,
         mastery_level: 30, // default
       });
     }
   }
   ```

3. Extract skills from materials (optional AI enhancement)

   ```typescript
   const skillsPrompt = `
   Based on the ${exam_board} curriculum for ${subject_name}, 
   extract the main concepts/skills covered in this material:
   
   ${text_content}
   
   Return JSON array of skills with weights.
   `;
   ```

**Estimated Time:** 2-3 days

---

### 12. Spaced Repetition Scheduling 🟥

**Status:** Not started (BKT ready for this)  
**Completion:** 0%  
**Files Affected:**

- `src/features/study/services/spacedRepetitionService.ts` 🟥
- `src/features/dashboard/pages/DashboardPage.tsx` ⚠️

**What's Missing:**

- 🟥 No scheduling algorithm
- 🟥 No "review due" notifications
- 🟥 No optimal review timing suggestions

**Implementation Steps:**

1. Calculate next review date

   ```typescript
   function calculateNextReview(mastery: number, lastReviewed: Date) {
     const intervals = [1, 3, 7, 14, 30, 60]; // days
     const intervalIndex = Math.floor(mastery / 20); // 0-5
     const interval = intervals[intervalIndex];

     return new Date(lastReviewed.getTime() + interval * 24 * 60 * 60 * 1000);
   }
   ```

2. Show review reminders

   - "3 concepts due for review today"
   - "Best time to review: [Concept Name]"

3. Generate review quizzes
   - Focus on concepts due for review
   - Use BKT to prioritize

**Estimated Time:** 2-3 days

---

## 🔵 LOW PRIORITY (Phase 2+)

### 13. Study Plan Page Integration 🟧

**Status:** Exists but isolated from main flow  
**Completion:** 40%  
**Files Affected:**

- `src/features/study/` (entire folder) 🟧
- `src/features/study-plan/` (entire folder) ✅

**What's Done:**

- ✅ Study plan generation service
- ✅ BKT integration in study-plan folder
- ✅ UI components for study plan display

**What's Missing:**

- 🟥 Not accessible from main flow
- 🟥 Requires quiz attempts to generate
- 🟥 Not integrated with dashboard
- 🟥 Topic mastery not synced with quizzes

**Implementation Steps:**

1. Move best components from study-plan to study
2. Generate study plan after sufficient data (3+ quiz attempts)
3. Show on dashboard as "Your Study Plan" card
4. Integrate task completion with study sessions

**Estimated Time:** 3-4 days

---

### 14. Mobile Responsiveness Refinement ⚠️

**Status:** Mostly responsive, needs polish  
**Completion:** 70%

**What Needs Work:**

- ⚠️ Quiz session on mobile (small buttons)
- ⚠️ Upload page on mobile (drag-drop area)
- ⚠️ Garden modal on mobile (too large)

**Estimated Time:** 2 days

---

### 15. Error Handling & Edge Cases ⚠️

**Status:** Basic error handling, needs improvement  
**Completion:** 50%

**What's Missing:**

- 🟥 Better error messages
- 🟥 Retry logic for failed uploads
- 🟥 Offline mode indicators
- 🟥 Loading state consistency

**Estimated Time:** 2-3 days

---

### 16. Analytics Dashboard 🟥

**Status:** Not started  
**Completion:** 0%

**Phase 2 Feature:**

- Per-subject accuracy tracking
- Topic weakness charts
- Progress over time graphs
- Study consistency heatmap

**Estimated Time:** 4-5 days

---

## 📅 Suggested Implementation Timeline

### **Week 1: Core Differentiators**

**Goal:** Make PassAI unique (not just another quiz app)

1. Day 1-2: Garden System Integration (Critical #1)
2. Day 3-4: BKT Integration (Critical #2)
3. Day 5: Teacher Layer Quiz Generation (Critical #3)

### **Week 2: User Experience**

**Goal:** Make it easy and delightful to use

4. Day 1: Auto-Generate Quiz After Upload (Critical #4)
5. Day 2-3: UX Flow Simplification (High #5)
6. Day 4-5: Study Time Tracking (High #6)

### **Week 3: Completeness**

**Goal:** Fill in the gaps

7. Day 1-2: Voice Recording Upload (High #7)
8. Day 3: Quick Stats Functional (High #8)
9. Day 4-5: Quiz Results Enhancement (Medium #9)

### **Week 4: Polish & Testing**

**Goal:** Refinement and bug fixes

10. Day 1: Material Coverage Tracking (Medium #10)
11. Day 2-3: Skill Extraction (Medium #11)
12. Day 4-5: Testing, bug fixes, polish

---

## 🎯 Success Metrics

### **Must-Have Before Launch:**

- ✅ Garden system shows after quiz completion
- ✅ Pass probability calculated and displayed
- ✅ Quiz questions use teacher layer info
- ✅ First upload auto-generates quiz
- ✅ Dashboard shows clear "next action"
- ✅ Study time tracked and displayed

### **Nice-to-Have Before Launch:**

- 🟢 Voice recording works
- 🟢 Material coverage tracked
- 🟢 Spaced repetition suggestions
- 🟢 Mobile fully polished

---

## 📝 Notes

**Technical Debt:**

- study-plan folder has duplicate BKT logic (consolidate with study folder)
- Some components have unused props (cleanup needed)
- Edge functions not visible in repo (may need creation)

**Questions for Founder:**

- Preference on voice transcription provider? (Whisper vs alternatives)
- Which exam boards to support initially? (IB, AP, A-Level, GCSE?)
- Garden point system: 10 points per correct answer? Or different?
- Pass probability threshold: 80% = likely pass?

---

## 🚀 Next Actions

1. **Review this roadmap with founder** - Get alignment on priorities
2. **Set up project board** - Track features in GitHub/Notion
3. **Start with Critical #1** - Garden System Integration
4. **Daily standups** - 15min check-ins on progress
5. **Weekly demos** - Show founder what's working

---

**Ready to start implementing? Let's begin with the Garden System! 🌱**
