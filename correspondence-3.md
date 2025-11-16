# PassAI Developer Questions - Detailed Answers

## Garden Emoticon System (Use Consistently Throughout App)

**Status/Progress Indicators:**

- 🌳 = Thriving/Excellent (85%+)
- 🌻 = Blooming/Very Good (70-85%)
- 🌿 = Healthy/Good (55-70%)
- 🌱 = Growing/Needs Work (40-55%)
- 💧 = Needs Water/Resting (<40%)

**Actions/Feedback:**

- 🌻 = Achievement/Success/Celebration
- 🌺 = Tip/Learning Point/Info
- 🎃 = Confirmation/Completed (Harvest)
- 🪴 = Focus Area/Needs Attention
- 💐 = Milestone/Special Achievement

---

## Q1: Quick Stats & Progress Indicators

### Quick Stats on Dashboard (SubjectOverview)

Display these three metrics in cards:

```typescript
// 1. Days Until Test
{
  icon: Calendar,
  value: daysUntilTest,  // e.g., "14"
  label: "days left",
  color: "purple"
}

// 2. Daily Study Time
{
  icon: Clock,
  value: hoursPerDay,    // e.g., "2h"
  label: "per day",
  color: "blue"
}

// 3. Quiz Progress
{
  icon: CheckCircle,
  value: `${quizzesCompleted}/${totalQuizzes}`,  // e.g., "3/10"
  label: "quizzes",
  color: "green"
}
```

**Data source:**

```sql
SELECT
  name,
  test_date,
  study_plan->'days_until_test' as days_until_test,
  study_plan->'hours_per_day' as hours_per_day,
  study_plan->'quizzes_completed' as quizzes_completed,
  study_plan->'total_quizzes_needed' as total_quizzes_needed
FROM subjects
WHERE user_id = $1;
```

### Basic Progress Indicators

**1. Pass Probability (Main metric)**

- Display: Large percentage (72%)
- Visualization: Gradient progress bar
- Update: After each quiz
- Calculation: From Bayesian mastery average

**2. Garden Health (Secondary metric)**

- Display: Percentage + label ("Thriving", "Healthy", "Needs Tending", "Resting")
- Visualization: Green gradient bar
- Update: Daily based on consistency
- Calculation: (days_met_target_in_last_7 / 7) \* 100

**3. Quiz Progress (Tertiary metric)**

- Display: Fraction (3/10 quizzes completed)
- Visualization: Small circular progress or simple text
- Update: After each quiz completion
- Calculation: Count of quiz_results / total_quizzes_needed

---

## Q2: Content Uploading - Voice Notes & Recordings

### Phase 1 Implementation (MVP)

Add voice recording capability to UploadMaterials page:

```typescript
// Add to UploadMaterials.tsx

const [isRecording, setIsRecording] = useState(false);
const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Please allow microphone access to record");
  }
}

function stopRecording() {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
    setIsRecording(false);
  }
}

async function saveRecording() {
  if (!audioBlob) return;

  // 1. Upload audio to Supabase Storage
  const fileName = `recording-${Date.now()}.webm`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("study-materials")
    .upload(`${subjectId}/${fileName}`, audioBlob);

  if (uploadError) throw uploadError;

  // 2. Transcribe using Whisper API (OpenAI)
  const formData = new FormData();
  formData.append("file", audioBlob, fileName);
  formData.append("model", "whisper-1");

  const transcribeRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const { text } = await transcribeRes.json();

  // 3. Save transcription to edge function
  await sendToEdgeFunction({
    subject_id: subjectId,
    file_name: fileName,
    text_content: text,
    source: "voice-recording",
  });

  alert("Recording saved and transcribed!");
  setAudioBlob(null);
}
```

**UI Component:**

```tsx
<Card className="p-6 shadow-lg">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Or Record Class Lecture
  </h3>

  <div className="flex flex-col items-center gap-4">
    {!isRecording && !audioBlob && (
      <Button
        onClick={startRecording}
        className="w-full h-16 bg-red-500 hover:bg-red-600"
      >
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
        Start Recording
      </Button>
    )}

    {isRecording && (
      <div className="w-full">
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-xl mb-4">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-3"></div>
          <span className="text-red-700 font-semibold">Recording...</span>
        </div>
        <Button onClick={stopRecording} variant="outline" className="w-full">
          Stop Recording
        </Button>
      </div>
    )}

    {audioBlob && (
      <div className="w-full space-y-3">
        <audio
          controls
          src={URL.createObjectURL(audioBlob)}
          className="w-full"
        />
        <div className="flex gap-3">
          <Button onClick={saveRecording} className="flex-1">
            Save & Transcribe
          </Button>
          <Button
            onClick={() => setAudioBlob(null)}
            variant="outline"
            className="flex-1"
          >
            Discard
          </Button>
        </div>
      </div>
    )}
  </div>

  <p className="text-xs text-gray-500 mt-4">
    🌺 Record your teacher's lecture and we'll transcribe it automatically
  </p>
</Card>
```

**Recommended approach:**

- Use browser's native `MediaRecorder` API
- Transcribe with OpenAI Whisper API
- Store audio in Supabase Storage (optional, for reference)
- Save transcription to study_materials table

---

## Q3: Quiz Results Screen - What to Show

Keep it simple and encouraging:

```typescript
// Basic Results Screen Components

// 1. Score Display (Large, centered)
<div className="text-center">
  <div className="text-5xl mb-2">
    {score >= 8 ? "🌳" : score >= 6 ? "🌻" : score >= 4 ? "🌿" : "💧"}
  </div>
  <h2 className="text-3xl font-bold text-gray-800">Garden Update!</h2>
  <p className="text-xl text-gray-600 mt-2">
    You scored <span className="font-bold text-green-600">{score}/10</span>
  </p>
  <div className="mt-3">
    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-lg font-semibold">
      {(score / 10 * 100)}%
    </span>
  </div>
  <p className="text-sm text-gray-500 mt-2">
    {score >= 8 ? "Your garden is thriving!" :
     score >= 6 ? "Your garden is blooming beautifully!" :
     score >= 4 ? "Your garden is growing - keep tending!" :
     "Every plant needs water - let's water your garden!"}
  </p>
</div>

// 2. Garden Growth Update
<Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
  <div className="flex items-center">
    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mr-4">
      <span className="text-2xl">🌱</span>
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">Your Garden Grew!</h3>
      <p className="text-sm text-gray-600">
        +{score * 3} growth points • Health increased by {Math.min(5, score)}%
      </p>
    </div>
  </div>
</Card>

// 3. Action Buttons
<div className="flex gap-3">
  <Button onClick={reviewAnswers} variant="outline" className="flex-1">
    Review Answers
  </Button>
  <Button onClick={generateNewQuiz} className="flex-1">
    New Quiz
  </Button>
</div>

// 4. Weak Areas (if score < 80%)
{score < 8 && weakConcepts.length > 0 && (
  <Card className="p-4 bg-amber-50 border border-amber-200">
    <div className="flex items-start gap-2">
      <span className="text-lg">🪴</span>
      <div>
        <p className="text-sm font-semibold text-amber-900">Areas to Tend:</p>
        <p className="text-sm text-amber-800">{weakConcepts.join(', ')}</p>
      </div>
    </div>
  </Card>
)}
```

**Key principles:**

- 🎃 Always encouraging (never "You failed")
- 🎃 Show concrete progress (garden grew)
- 🎃 Immediate next action (New Quiz button)
- 🎃 Optional review (not forced)

---

## Q4: Teacher Layer - First Iteration Parameters

### Minimum Viable Teacher Profile

**What to collect from users:**

```typescript
// subjects table - add these columns
{
  // Basic Info
  exam_board: string,           // e.g., "IB", "AP", "A-Level", "GCSE"
  teacher_name: string,          // Optional

  // Emphasis (JSON array)
  teacher_emphasis: string[],    // e.g., ["Essay writing", "Multiple choice", "Lab reports"]

  // Question Style (enum)
  question_style: string,        // "multiple_choice" | "short_answer" | "essay" | "mixed"

  // Grading Rubric (optional, for later)
  grading_rubric: string | null  // Free text or structured JSON
}
```

**UI for Teacher Layer:**

```tsx
// Add to subject creation/edit form

<Card className="p-6 shadow-lg">
  <h3 className="text-lg font-semibold mb-4">Teacher Information</h3>

  {/* 1. Exam Board (Required) */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Exam Board / Curriculum *
    </label>
    <select className="w-full border-2 border-gray-200 rounded-lg p-3">
      <option value="">Select exam board...</option>
      <option value="IB">IB (International Baccalaureate)</option>
      <option value="AP">AP (Advanced Placement)</option>
      <option value="A-Level">A-Level (UK)</option>
      <option value="GCSE">GCSE (UK)</option>
      <option value="SAT">SAT Subject Tests</option>
      <option value="State">State/National Curriculum</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* 2. Teacher Name (Optional) */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Teacher Name (optional)
    </label>
    <input
      type="text"
      placeholder="e.g., Mrs. Smith"
      className="w-full border-2 border-gray-200 rounded-lg p-3"
    />
  </div>

  {/* 3. Question Style */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Typical Question Format
    </label>
    <select className="w-full border-2 border-gray-200 rounded-lg p-3">
      <option value="multiple_choice">Multiple Choice</option>
      <option value="short_answer">Short Answer</option>
      <option value="essay">Essay / Long Form</option>
      <option value="mixed">Mixed Format</option>
    </select>
  </div>

  {/* 4. Teacher Emphasis (Tags) */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      What does your teacher emphasize?
    </label>
    <p className="text-xs text-gray-500 mb-2">
      Add topics your teacher says "will definitely be on the test"
    </p>
    <div className="flex gap-2 mb-2 flex-wrap">
      {teacherEmphasis.map((item, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
        >
          {item}
          <button
            onClick={() => removeEmphasis(i)}
            className="ml-2 text-purple-500 hover:text-purple-700"
          >
            ×
          </button>
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="e.g., Essay structure"
        className="flex-1 border-2 border-gray-200 rounded-lg p-2 text-sm"
        onKeyPress={(e) => e.key === "Enter" && addEmphasis()}
      />
      <Button onClick={addEmphasis} size="sm">
        Add
      </Button>
    </div>
  </div>

  {/* Info box */}
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="text-sm text-blue-800 flex items-start gap-2">
      <span>🌺</span>
      <span>
        The more specific you are, the better your quizzes will match your
        actual exam
      </span>
    </p>
  </div>
</Card>
```

**How to use in quiz generation:**

```typescript
// In generate-quiz edge function
const { exam_board, question_style, teacher_emphasis } = subject;

const systemPrompt = `
You are generating quiz questions for a ${exam_board} ${subjectName} exam.

Question Style: ${question_style}
Teacher Emphasis: ${teacher_emphasis.join(", ")}

Generate questions that:
- Match the ${exam_board} curriculum standards
- Use ${question_style} format
- Focus on: ${teacher_emphasis.join(", ")}
- Use terminology common in ${exam_board} exams

[Rest of prompt...]
`;
```

**Phase 2 additions (later):**

- Grading rubric upload
- Sample test upload
- Teacher comment analysis
- Past exam question patterns

---

## Q5: Auto-Generate Quiz vs Manual

### Recommended: Hybrid Approach

**Best User Experience:**

1. **After FIRST upload** → Auto-generate quiz immediately
2. **After subsequent uploads** → Show notification with button
3. **Always allow manual generation** from Quiz Center

**Implementation:**

```typescript
// In process-upload edge function

// Check if this is first material for subject
const { count } = await supabase
  .from("study_materials")
  .select("id", { count: "exact", head: true })
  .eq("subject_id", subject_id);

const isFirstUpload = (count ?? 0) === 1;

if (isFirstUpload) {
  // Auto-generate first quiz
  await supabase.functions.invoke("generate-quiz", {
    body: { bucketId: bucket_id, subjectId: subject_id },
  });

  return {
    success: true,
    message: "Material saved! Generating your first quiz...",
    auto_generated_quiz: true,
  };
} else {
  return {
    success: true,
    message: "Material saved! Ready to generate a new quiz.",
    auto_generated_quiz: false,
  };
}
```

**UI Flow:**

```tsx
// After upload completes

if (response.auto_generated_quiz) {
  // First upload - show immediate feedback
  showNotification({
    title: "🌻 Your first quiz is ready!",
    message: "We've generated questions from your material",
    action: "Take Quiz Now",
    onClick: () => router.push("/quiz"),
  });
} else {
  // Subsequent uploads - gentle nudge
  showNotification({
    title: "🎃 Material added!",
    message: "Want to generate a new quiz with this content?",
    action: "Generate Quiz",
    onClick: () => generateNewQuiz(),
    dismissable: true,
  });
}
```

**Benefits:**

- 🎃 First-time users get immediate value (see the product work)
- 🎃 Subsequent uploads don't overwhelm with auto-quizzes
- 🎃 Users always have control (manual generation available)
- 🎃 Reduces decision fatigue for new users

---

## Q6: Deployment - Lovable vs Vercel

### Recommended: Keep in Lovable (for now)

**Reasoning:**

**Pros of staying in Lovable:**

- 🎃 Already set up and working
- 🎃 Integrated with your current workflow
- 🎃 Easier to iterate and update
- 🎃 No additional devops setup needed
- 🎃 Domain connection already configured

**Pros of moving to Vercel:**

- 🎃 More control over build pipeline
- 🎃 Better performance optimization options
- 🎃 Easier to add custom middleware
- 🎃 More deployment flexibility

**Recommendation for Phase 1 (MVP):**
→ **Stay in Lovable**, push code through Lovable's pipeline

**Why:**

1. You're already familiar with the workflow
2. Faster to iterate and fix bugs
3. Less infrastructure to manage during MVP
4. Can always migrate to Vercel later if needed

**Migration Path (Phase 2+):**

```
MVP Launch (Lovable)
    ↓
Gather user feedback
    ↓
Stabilize features
    ↓
Consider Vercel migration when:
- Need more build control
- Want custom edge functions
- Require better analytics
- Scale demands it
```

**Lovable → Vercel migration is straightforward when ready:**

1. Export code from Lovable
2. Initialize Next.js project in Vercel
3. Copy environment variables
4. Connect domain
5. Deploy

**Answer: Update code in Lovable for Phase 1. Migrate to Vercel in Phase 2 if needed.**

---

## Q7: Garden Health Visualization - Examples

### Visual Design Ideas

**Option 1: Minimalist Plant States (Recommended)**

```tsx
// Simple, clean, professional

function GardenVisualization({ health }: { health: number }) {
  return (
    <div className="relative w-full h-48 bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl overflow-hidden">
      {/* Sky/Background */}
      <div className="absolute inset-0">
        {/* Simple gradient, no clutter */}
      </div>

      {/* Plant - changes based on health */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        {health >= 85 && <ThrivingPlant />} {/* Tall, vibrant */}
        {health >= 60 && health < 85 && <HealthyPlant />} {/* Medium, steady */}
        {health >= 40 && health < 60 && <NeedsTendingPlant />}{" "}
        {/* Smaller, muted */}
        {health < 40 && <RestingPlant />} {/* Small, dormant */}
      </div>

      {/* Health percentage */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-xl font-bold text-green-600">{health}%</span>
      </div>
    </div>
  );
}

// Plant SVG components (simple, geometric)
function ThrivingPlant() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140">
      {/* Stem - tall and strong */}
      <line x1="60" y1="140" x2="60" y2="40" stroke="#10B981" strokeWidth="8" />

      {/* Leaves - multiple, vibrant */}
      <ellipse cx="35" cy="60" rx="20" ry="15" fill="#22C55E" opacity="0.9" />
      <ellipse cx="85" cy="60" rx="20" ry="15" fill="#22C55E" opacity="0.9" />
      <ellipse cx="30" cy="90" rx="18" ry="13" fill="#10B981" opacity="0.8" />
      <ellipse cx="90" cy="90" rx="18" ry="13" fill="#10B981" opacity="0.8" />

      {/* Bloom */}
      <circle cx="60" cy="35" r="15" fill="#A78BFA" opacity="0.9" />
      <circle cx="60" cy="35" r="8" fill="#FCD34D" opacity="0.9" />

      {/* Gentle sway animation */}
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="-2 60 140"
        to="2 60 140"
        dur="3s"
        repeatCount="indefinite"
      />
    </svg>
  );
}

function HealthyPlant() {
  return (
    <svg width="100" height="120" viewBox="0 0 100 120">
      <line x1="50" y1="120" x2="50" y2="50" stroke="#10B981" strokeWidth="6" />
      <ellipse cx="30" cy="70" rx="15" ry="12" fill="#22C55E" opacity="0.8" />
      <ellipse cx="70" cy="70" rx="15" ry="12" fill="#22C55E" opacity="0.8" />
      <ellipse cx="50" cy="45" rx="12" ry="10" fill="#10B981" opacity="0.7" />
    </svg>
  );
}

function NeedsTendingPlant() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100">
      <line x1="40" y1="100" x2="40" y2="60" stroke="#84CC16" strokeWidth="5" />
      <ellipse cx="30" cy="75" rx="12" ry="10" fill="#A3E635" opacity="0.6" />
      <ellipse cx="50" cy="75" rx="12" ry="10" fill="#A3E635" opacity="0.6" />
      {/* Slightly droopy */}
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 40 100"
        to="-5 40 100"
        dur="2s"
        repeatCount="1"
      />
    </svg>
  );
}

function RestingPlant() {
  return (
    <svg width="60" height="80" viewBox="0 0 60 80">
      <line x1="30" y1="80" x2="30" y2="60" stroke="#9CA3AF" strokeWidth="4" />
      <ellipse cx="30" cy="65" rx="10" ry="8" fill="#D1D5DB" opacity="0.5" />
      {/* Small, dormant - not dead */}
    </svg>
  );
}
```

**Option 2: Progress Bar with Plant Emoticon**

```tsx
function GardenHealth({ health }: { health: number }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mr-4">
            <span className="text-3xl">
              {health >= 85
                ? "🌳"
                : health >= 70
                ? "🌻"
                : health >= 55
                ? "🌿"
                : health >= 40
                ? "🌱"
                : "💧"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Your Garden</h3>
            <p className="text-sm text-gray-500">
              {health >= 85
                ? "Thriving"
                : health >= 70
                ? "Blooming"
                : health >= 55
                ? "Healthy"
                : health >= 40
                ? "Growing"
                : "Needs Water"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{health}%</p>
        </div>
      </div>

      {/* Gradient progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${getHealthGradient(
            health
          )}`}
          style={{ width: `${health}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">Last tended 6 hours ago</p>
    </Card>
  );
}
```

**Option 3: Circular Progress (iOS Style)**

```tsx
function CircularGarden({ health }: { health: number }) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (health / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      {/* Background circle */}
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#healthGradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient
            id="healthGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl mb-1">🌱</span>
        <span className="text-xl font-bold text-gray-800">{health}%</span>
      </div>
    </div>
  );
}
```

**Recommendation:** Start with **Option 2** (simplest to implement). Add **Option 1** (animated plant) in Phase 2.

### Daily Study Time Tracker

**What it tracks:**

- Did student meet their daily time goal?
- What days in the last 7 did they study?

**Implementation:**

```typescript
// study_sessions table
{
  id: uuid,
  user_id: uuid,
  subject_id: uuid,
  date: date,               // e.g., "2025-11-06"
  minutes_studied: integer, // e.g., 45
  target_minutes: integer,  // e.g., 120 (2 hours)
  met_target: boolean,      // minutes_studied >= target_minutes
  activities: jsonb         // { quiz: 20, review: 25 }
}
```

**Tracking logic:**

```typescript
// After quiz or study session
async function logStudyTime(params: {
  subject_id: string;
  minutes: number;
  activity: "quiz" | "review" | "upload";
}) {
  const today = new Date().toISOString().split("T")[0];

  // Upsert today's session
  const { data: session } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("subject_id", params.subject_id)
    .eq("date", today)
    .single();

  const targetMinutes = 120; // 2 hours default

  if (session) {
    // Add to existing session
    const newTotal = session.minutes_studied + params.minutes;
    await supabase
      .from("study_sessions")
      .update({
        minutes_studied: newTotal,
        met_target: newTotal >= targetMinutes,
        activities: {
          ...session.activities,
          [params.activity]:
            (session.activities[params.activity] || 0) + params.minutes,
        },
      })
      .eq("id", session.id);
  } else {
    // Create new session
    await supabase.from("study_sessions").insert({
      subject_id: params.subject_id,
      date: today,
      minutes_studied: params.minutes,
      target_minutes: targetMinutes,
      met_target: params.minutes >= targetMinutes,
      activities: { [params.activity]: params.minutes },
    });
  }

  // Recalculate garden health
  await updateGardenHealth(params.subject_id);
}

// Calculate garden health from last 7 days
async function updateGardenHealth(subject_id: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("met_target")
    .eq("subject_id", subject_id)
    .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

  const daysMetTarget = sessions?.filter((s) => s.met_target).length || 0;
  const health = Math.round((daysMetTarget / 7) * 100);

  await supabase
    .from("subjects")
    .update({
      study_plan: {
        ...existing_study_plan,
        garden_health: health,
        last_studied: new Date().toISOString(),
      },
    })
    .eq("id", subject_id);
}
```

**UI Display:**

```tsx
// Weekly calendar view
function WeeklyTracker({ sessions }: { sessions: StudySession[] }) {
  const last7Days = getLast7Days();

  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">This Week</h4>
      <div className="flex justify-between gap-2">
        {last7Days.map((date, i) => {
          const session = sessions.find((s) => s.date === date);
          const metTarget = session?.met_target || false;

          return (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-1 ${
                  metTarget
                    ? "bg-green-500 text-white"
                    : session
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {metTarget
                  ? "🎃"
                  : session
                  ? Math.round(session.minutes_studied / 60)
                  : ""}
              </div>
              <span className="text-xs text-gray-500">
                {["S", "M", "T", "W", "T", "F", "S"][new Date(date).getDay()]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        {sessions.filter((s) => s.met_target).length}/7 days met target
      </p>
    </Card>
  );
}
```

---

## Q8: Skills System Explanation

### What are "Skills"?

Skills are the **individual concepts/topics** within a subject that PassAI tracks mastery for.

**Example for English:**

- Skills: ["Literary Analysis", "Essay Structure", "Character Development", "Theme Analysis", "Poetry Analysis"]

**Example for Chemistry:**

- Skills: ["Stoichiometry", "Gas Laws", "Thermodynamics", "Acid-Base Reactions", "Electrochemistry"]

### Why Skills Matter

**Without skills:**

- "You scored 70% on the quiz" ❌
- Generic recommendations
- No targeted improvement

**With skills:**

- "You scored 70% overall" 🎃
- "You're strong in Essay Structure (85%)" 🎃
- "Focus on Literary Analysis (55%)" 🎃
- Specific, actionable feedback

### How Skills Work (Bayesian Knowledge Tracing)

```typescript
// skills table
{
  id: uuid,
  subject_id: uuid,
  tag: string,              // e.g., "Literary Analysis"
  weight: number,           // Exam importance (0-1), sum = 1 across subject
  p: number,                // Current mastery probability (0-1)
  half_life: number,        // Forgetting rate in days (e.g., 7)
  updated_at: timestamp
}
```

**When student answers a question:**

1. **Tag question with skill**

   ```typescript
   {
     q: "Analyze the symbolism in chapter 3",
     choices: [...],
     answer_index: 2,
     skill_tag: "Literary Analysis"  // ← Links to skill
   }
   ```

2. **Update mastery using Bayesian inference**

   ```typescript
   // If answer is correct
   p_new = (p * (1 - slip)) / [p * (1 - slip) + (1 - p) * guess];
   p_learned = p_new + (1 - p_new) * learn_rate;

   // If answer is incorrect
   p_new = (p * slip) / [p * slip + (1 - p) * (1 - guess)];
   p_learned = p_new + (1 - p_new) * learn_rate;
   ```

   **Parameters:**

   - slip = 0.10 (chance of careless mistake when you know it)
   - guess = 0.20 (chance of lucky guess when you don't)
   - learn_rate = 0.20 (probability of learning from attempt)

3. **Skill mastery updates in database**

   ```sql
   UPDATE skills
   SET p = p_learned,
       updated_at = NOW()
   WHERE tag = 'Literary Analysis'
     AND subject_id = $1;
   ```

4. **Calculate overall pass probability**

   ```typescript
   // Weighted average of all skills
   passProb = Σ(weight_k * p_k);

   // Example:
   // Literary Analysis (weight: 0.25, p: 0.65)
   // Essay Structure   (weight: 0.25, p: 0.80)
   // Character Dev     (weight: 0.20, p: 0.75)
   // Theme Analysis    (weight: 0.15, p: 0.70)
   // Poetry            (weight: 0.15, p: 0.60)
   //
   // Pass Prob = 0.25*0.65 + 0.25*0.80 + 0.20*0.75 + 0.15*0.70 + 0.15*0.60
   //           = 0.7025 = 70%
   ```

### How to Extract Skills from Materials

**Option 1: AI Extraction (Recommended)**

```typescript
// In process-upload edge function

const skillsPrompt = `
Based on the ${exam_board} curriculum for ${subject_name}, 
extract the main concepts/skills covered in this material:

${text_content}

Return a JSON array of skills with weights:
[
  { "tag": "Literary Analysis", "weight": 0.25 },
  { "tag": "Essay Structure", "weight": 0.25 },
  ...
]

Weights should sum to 1.0.
`;

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: skillsPrompt }],
  response_format: { type: "json_object" },
});

const skills = JSON.parse(response.choices[0].message.content).skills;

// Insert into database
for (const skill of skills) {
  await supabase.from("skills").upsert(
    {
      subject_id,
      tag: skill.tag,
      weight: skill.weight,
      p: 0.5, // Start at 50% mastery
      half_life: 7, // Default 1 week
    },
    { onConflict: "subject_id,tag" }
  );
}
```

**Option 2: Predefined Templates**

```typescript
// For common exam boards
const IB_ENGLISH_SKILLS = [
  { tag: "Literary Analysis", weight: 0.3 },
  { tag: "Essay Writing", weight: 0.25 },
  { tag: "Comparative Analysis", weight: 0.2 },
  { tag: "Textual Features", weight: 0.15 },
  { tag: "Context & Interpretation", weight: 0.1 },
];

const AP_CHEMISTRY_SKILLS = [
  { tag: "Stoichiometry", weight: 0.2 },
  { tag: "Thermodynamics", weight: 0.18 },
  { tag: "Kinetics", weight: 0.15 },
  // etc.
];
```

### Phase 1 Simplification

**For MVP, you can:**

1. **Use exam board templates** (predefined skills)
2. **Start with 5-7 skills per subject** (manageable)
3. **Equal weights initially** (refine later based on teacher input)
4. **Manual skill tagging** (add skill dropdown when creating questions)

**Example implementation:**

```typescript
// When subject is created, auto-populate skills

const SKILL_TEMPLATES = {
  IB: {
    English: [
      "Literary Analysis",
      "Essay Writing",
      "Comparative Analysis",
      "Textual Features",
      "Context",
    ],
    Chemistry: [
      "Stoichiometry",
      "Thermodynamics",
      "Kinetics",
      "Equilibrium",
      "Acids & Bases",
    ],
  },
  AP: {
    English: [
      "Rhetorical Analysis",
      "Argument",
      "Synthesis",
      "Style",
      "Evidence",
    ],
    Chemistry: [
      "Atomic Structure",
      "Bonding",
      "Reactions",
      "Thermodynamics",
      "Equilibrium",
    ],
  },
};

// On subject creation
const template = SKILL_TEMPLATES[exam_board]?.[subject_name];
if (template) {
  const weight = 1 / template.length;
  for (const tag of template) {
    await supabase.from("skills").insert({
      subject_id,
      tag,
      weight,
      p: 0.5,
      half_life: 7,
    });
  }
}
```

---

## Q9: Partnership & Next Steps

### Response to Partnership Proposal

**Your developer is asking:**

> "I would be happy to work with you to get this MVP up and running, and ready to test, improve on it, scale and handle bug fixes. I would also love to see the app working and running and actually delivering on what it's supposed to and helping students. So I would be glad to get us to a functional working model, and if you like the result we can make this partnership work in future and scale the project into something solid. What do you think?"

**Suggested response:**

---

_"I really appreciate your enthusiasm and commitment to getting PassAI working well! Your questions show you're thinking deeply about the user experience and technical implementation, which is exactly what we need._

_Here's what I propose:_

### Phase 1: MVP Partnership (Next 4 weeks)

**Your role:**

- Build out the core pages (Dashboard, Upload, Quiz, Study Plan)
- Integrate with Supabase and existing edge functions
- Implement the teacher layer and skills system
- Handle bug fixes and polish

**My role:**

- Provide ongoing design and UX guidance
- Write/refine prompts for quiz generation
- Test with real students (I'm a teacher)
- Iterate on features based on feedback

**Compensation:**

- [Discuss: Hourly rate? Fixed project fee? Equity consideration?]
- Option to continue into Phase 2 if MVP succeeds

### Success Metrics (to evaluate partnership):

1. **MVP Launch** - App live and functional on domain
2. **Student Testing** - 10-20 students using for 2 weeks
3. **Core Features Working:**
   - Upload → Quiz generation → Results → Garden update
   - Pass probability projections within ±10% accuracy
   - 7-day retention rate > 50%

### Phase 2: Scale (If MVP succeeds)

If we hit our metrics and both feel good about working together:

**Potential partnership structure:**

- Continue development (new features, optimizations)
- Possibly equity stake vs. salary
- Long-term scaling roadmap (LMS integrations, mobile app, etc.)

**My preference:** Let's prove the concept in Phase 1 first, then discuss formal partnership terms if the product is working and students love it.

### What I need from you:

1. **Time estimate** - How long do you think Phase 1 will take?
2. **Rate/Budget** - What are your rates and what's realistic for this MVP?
3. **Availability** - How many hours/week can you commit?

_Sound reasonable? Let's get PassAI helping students!_"

---

## Summary of Key Decisions

| Question                 | Answer                                                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Quick Stats**          | Days left, Hours/day, Quizzes completed/total                                                                                    |
| **Progress Indicators**  | Pass probability (main), Garden health (secondary), Quiz progress (tertiary)                                                     |
| **Voice Recording**      | Add to Upload page, use MediaRecorder + Whisper API                                                                              |
| **Quiz Results**         | Score + garden emoticon, Garden growth feedback, Review/New Quiz buttons                                                         |
| **Teacher Layer**        | Exam board (required), Question style, Teacher emphasis tags, Teacher name (optional)                                            |
| **Auto-generate Quiz**   | Yes for FIRST upload, gentle nudge for subsequent uploads, always allow manual                                                   |
| **Deployment**           | Stay in Lovable for Phase 1, consider Vercel for Phase 2                                                                         |
| **Garden Visualization** | Start with progress bar + emoticon (simple), add animated plant in Phase 2                                                       |
| **Study Time Tracker**   | Track daily sessions in last 7 days, update garden health based on consistency                                                   |
| **Skills System**        | Individual concepts tracked with Bayesian mastery, use templates for MVP                                                         |
| **Partnership**          | 4-week MVP phase, evaluate success metrics, then discuss long-term partnership                                                   |
| **Garden Emoticons**     | 🌳 (thriving), 🌻 (blooming), 🌿 (healthy), 🌱 (growing), 💧 (needs water), 🌺 (tip), 🎃 (completed), 🪴 (focus), 💐 (milestone) |

---

## Garden Emoticon Quick Reference

**Use these consistently throughout the app:**

```typescript
// Status indicators by percentage
const getGardenEmoticon = (percentage: number) => {
  if (percentage >= 85) return "🌳"; // Thriving
  if (percentage >= 70) return "🌻"; // Blooming
  if (percentage >= 55) return "🌿"; // Healthy
  if (percentage >= 40) return "🌱"; // Growing
  return "💧"; // Needs water
};

// Action feedback
const ACTION_EMOTICONS = {
  success: "🌻", // Achievement
  tip: "🌺", // Learning point
  completed: "🎃", // Task done (harvest)
  focus: "🪴", // Needs attention
  milestone: "💐", // Special achievement
};
```

---

These answers should give your developer everything needed to start building Phase 1 with consistent garden theming! Let me know if any clarification is needed.
