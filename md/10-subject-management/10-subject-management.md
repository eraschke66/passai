# Phase 2: Subject Management

## 🎯 What We're Building

A system for students to organize their studies by subjects. Each subject represents something they're studying for (like "Biology Midterm" or "Chemistry Final"). Subjects are the top-level container - students upload materials to subjects, generate quizzes from subjects, and track progress per subject.

## 👤 User Experience

### Creating a Subject

1. Student clicks "New Subject" or "Add Subject"
2. Fills in:

   - **Subject name** (e.g., "Biology Midterm")
   - **Description** (optional, e.g., "Chapters 1-5, focus on cell biology")
   - **Test date** (optional, when the exam is)
   - **Exam board** (optional, dropdown to pick what type of exam they are prepping for)
   - **Teacher emphasis** (optional, what the teacher emphasized on in this subject)

3. Automatically picked for each subject (give each a random fitting default)
   - **Icon & color** (to visually distinguish subjects)
4. Clicks "Create"
5. Subject appears in their dashboard
6. Can immediately start uploading materials to it

### Viewing Subjects

- **Subjects page shows all subjects** in a grid or list
- Each subject card shows:
  - Name and description
  - Test date (if set) with countdown (e.g., "14 days until exam")
  - Progress indicator (percentage studied)
  - Pass chance prediction (e.g., "78% likely to pass")
  - Number of materials uploaded
  - Number of quizzes taken
  - Quick actions: Upload, Generate Quiz, View Details
- Can sort/filter subjects:
  - By test date (soonest first)
  - By progress (least to most)
  - By name (alphabetical)
  - Active vs archived

### Editing a Subject

1. Student clicks on subject card or "Edit" button
2. Can update:
   - Name
   - Description
   - Test date
   - Icon/color
3. Changes save automatically or with "Save" button
4. Returns to dashboard

### Deleting a Subject

1. Student clicks "Delete" on a subject
2. Confirmation modal: "Are you sure? This will delete all materials and quizzes for this subject."
3. Must type subject name to confirm (prevents accidental deletion)
4. Subject and all related data deleted permanently

### Subject Detail View

- Click on a subject to see detailed view:
  - All uploaded materials (list with previews)
  - All quizzes taken (with scores and dates)
  - Progress chart over time
  - Study plan recommendations
  - Quick actions: Upload Material, Generate Quiz

## 📋 Requirements

### Core Features

- ✅ **Create subjects** with name, description, test date
- ✅ **View all subjects** in dashboard
- ✅ **Edit subject** details
- ✅ **Delete subject** (with confirmation)
- ✅ **Subject detail page** showing materials, quizzes, progress

### Subject Properties

- ✅ **Name** (required, max 100 characters)
- ✅ **Description** (optional, max 500 characters)
- ✅ **Test date** (optional, date in the future)
- ✅ **Icon/color** (optional, for visual distinction)
- ✅ **Progress** (calculated, 0-100%, start with a default)
- ✅ **Pass chance** (calculated, 0-100%, start with a default)
- ✅ **Exam board** (optional)
- ✅ **Teacher emphasis** (optional)
- ✅ **Created date** (automatic)
- ✅ **Updated date** (automatic)
- ✅ **Last studied** (automatic, updated when quiz taken or other study exercises logged)

### Subjects Page Display

- ✅ **Grid/list view toggle** (user preference)
- ✅ **Sort options:**
  - Test date (soonest first)
  - Progress (least first)
  - Name (A-Z)
  - Created date (newest first)
- ✅ **Filter options:**
  - Active subjects (have upcoming test)
  - Archived subjects (test date passed)
  - All subjects
- ✅ **Search** subjects by name

### Validation & Limits

- ✅ **Name required** - Cannot create without name
- ✅ **Test date validation** - Must be in future (optional warning if very far)
- ✅ **Subject limit** - Free users: 3 subjects max, Premium: unlimited (To be implemented in the future)
- ✅ **Duplicate names** - Warn if name already exists [checked for each user personally, not globally] (but allow)

### Progress Calculation

Progress is calculated based on: (will refine this later)

- Number of materials uploaded (more materials = foundation laid)
- Number of quizzes taken (more quizzes = more practice)
- Recent quiz scores (improving scores = making progress)
- Time spent studying (if we track this)

Formula example:

```
progress = (materials_weight * materials_score) +
           (quizzes_weight * quiz_score) +
           (performance_weight * performance_trend)

Where:
- materials_score = min(num_materials / 5, 1) * 100
- quiz_score = min(num_quizzes / 10, 1) * 100
- performance_trend = average of last 3 quiz scores
```

### Pass Chance Calculation

(Placeholder for now - will be detailed in Analytics phase. Use a basic form of Bayesian Inference)

- Based on quiz performance
- Time until test date
- Study consistency
- For now, can show simplified version or "Need more data"

## 🔄 User Flow

### First Time User (No Subjects)

```
Login → Dashboard
    ↓
Empty state: "Get started by creating your first subject"
    ↓
Click "Create Subject"
    ↓
Fill in form (name, description, test date, etc)
    ↓
Click "Create"
    ↓
Subject appears in dashboard
    ↓
Click subject → See empty materials/quizzes
    ↓
"Upload your first material" prompt
```

### Returning User (Has Subjects)

```
Login → Dashboard
    ↓
See all subjects with progress
    ↓
Click subject → Subject detail page
    ↓
See materials, quizzes, progress
    ↓
Can upload material or generate quiz
```

### Managing Multiple Subjects

```
Dashboard with subjects
    ↓
Sort by test date → See which exam is soonest
    ↓
Click on closest exam subject
    ↓
Check progress and pass chance
    ↓
Decide to take more quizzes or upload more materials
```

## 🎨 UI/UX Considerations

### Dashboard Layout

- **Grid view** (cards) - More visual, good for 3-6 subjects
- **List view** - More compact, good for 7+ subjects
- **Empty state** - Friendly, helpful message when no subjects
- **Loading state** - Skeleton cards while fetching

### Subject Cards

- **Visual hierarchy:**
  - Subject name (large, bold)
  - Test date with countdown (prominent if soon)
  - Progress bar (visual indicator)
  - Pass chance badge (color-coded: red <50%, yellow 50-75%, green >75%)
- **Quick actions on hover:**
  - Upload material
  - Generate quiz
  - View details
  - Edit
  - Delete
- **Color coding:**
  - Red border if test is within 7 days
  - Gray out if test date has passed

### Create/Edit Form

- **Simple, focused** - Only essential fields visible initially
- **Optional fields collapsible** - "Advanced options" section
- **Live preview** - Show what the card will look like
- **Validation feedback** - Inline, instant
- **Date picker** - Calendar interface for test date

### Delete Confirmation

- **Scary but clear** - Red modal, emphasize data loss
- **Type to confirm** - Must type subject name
- **Show impact** - "This will delete X materials and Y quizzes"
- **Cannot undo** - Make this very clear

### Subject Detail Page

- **Header:** Subject name, description, test date countdown
- **Tabs:**
  - Materials (list of uploaded files)
  - Quizzes (history with scores)
  - Analytics (progress charts)
  - Settings (edit subject)
- **Floating action button** - "Generate Quiz" always visible

## 🔗 Integration Points

### Database (subjects table)

(I may have missed a couple here, add them too)

```
subjects:
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- name (text, required)
- description (text, nullable)
- test_date (date, nullable)
- icon (text, nullable)
- color (text, nullable)
- progress (integer, 0-100, default 0)
- pass_chance (integer, 0-100, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- last_studied_at (timestamp, nullable)
```

### Related Tables

(Features will be worked on later, just keep this in mind for context)

- **study_materials:** Links to subjects (subject_id)
- **quizzes:** Links to subjects (subject_id)
- **study_plans:** Links to subjects (subject_id)

### Row Level Security (RLS)

- Users can only see/edit their own subjects
- Supabase RLS policies:
  - `SELECT`: user_id = auth.uid()
  - `INSERT`: user_id = auth.uid()
  - `UPDATE`: user_id = auth.uid()
  - `DELETE`: user_id = auth.uid()

### Free Tier Limits

Check subscription tier before allowing create: (Not implement this for the moment, but leave it open and easy to do so for the future)

- Free: max 3 subjects
- Premium: unlimited
  Show upgrade prompt when limit reached

## ⚙️ Technical Considerations

### Real-time Updates

- Use Supabase real-time subscriptions for progress updates
- When a quiz is taken or study action taken, progress auto-updates
- When material is uploaded, count updates

### Data Fetching

- Fetch subjects list on dashboard mount
- Cache with React Query (5 minute stale time)
- Try to avoid refetching on every focus. I don't like that expereince where you see loading states every time you visit the tab
- Optimistic updates for create/edit/delete

### Search & Filter

- Client-side filtering for small subject lists (<50)
- Server-side filtering for large lists (>50)
- Debounce search input (300ms)

### Performance

- Lazy load subject detail pages
- Paginate quizzes if more than 20
- Compress images for icons

### Calculations

- Calculate progress on client for now (indicate this should be taken to backend in the future)
- Cache calculations to avoid re-computing on every render. We can store calculations results in database to avoid calculation every time
- Recalculate when materials/quizzes change

## ✅ Acceptance Criteria

The subject management system is complete when:

1. **Create Subject Works:**

   - ✅ Can create subject with name
   - ✅ Can add optional description, test date, exam board and teacher emphasis
   - ✅ Subject appears immediately in dashboard
   - ✅ Free users limited to 3 subjects (Not reinforced now. Keep the door open for it in the future)

2. **View Subjects Works:**

   - ✅ Dashboard shows all user's subjects
   - ✅ Each card shows name, progress, pass chance
   - ✅ Test date shows countdown if set
   - ✅ Empty state shown when no subjects

3. **Edit Subject Works:**

   - ✅ Can edit most subject fields
   - ✅ Changes save correctly
   - ✅ UI updates immediately

4. **Delete Subject Works:**

   - ✅ Confirmation modal shown
   - ✅ Must type name to confirm
   - ✅ Subject and all data deleted
   - ✅ Dashboard updates immediately

5. **Subject Detail Page Works:**

   - ✅ Shows subject info
   - ✅ Lists materials (even if empty)
   - ✅ Lists quizzes (even if empty)
   - ✅ Shows progress chart

6. **Progress Calculation Works:**

   - ✅ Progress updates when quizzes taken
   - ✅ Progress updates when materials added
   - ✅ Progress shown as percentage and bar

7. **Sorting & Filtering Works:**

   - ✅ Can sort by date, progress, name
   - ✅ Can filter active/archived/all
   - ✅ Can search by name

8. **Responsive Design Works:**
   - ✅ Grid adapts to screen size
   - ✅ Cards look good on mobile
   - ✅ Forms work on small screens

## 🚧 Prerequisites

**Required:**

- ✅ Authentication system (Phase 1) - Completed
- ✅ Supabase database with `subjects` table - We will create in the process

---

**Once subject management is complete, students can organize their studies, and we can build materials and quizzes on top of this structure.**
