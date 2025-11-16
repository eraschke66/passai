Looking over the roadmap I see you are also doing phase 2. So let’s try and get back on track. Here are what I need for the first two phases. Once you read over this let me know your thoughts and timeline. I’ve also added some options below about payment.. Please look them over and give me your thoughts.

Phase 1: Core Platform Stability (Q4 2025)

Objective

Establish reliable upload → extract → quiz generation pipeline. Students can upload materials, generate quizzes, and see basic progress.

User Interface Deliverables

1. SubjectOverview.tsx - Main dashboard

   - Subject selection

   - Quick stats display

   - Navigation to upload and quiz

   - Basic progress indicators

You have about 65% of this working, right?

2. UploadMaterials.tsx - Content upload

   - Drag-and-drop file upload

   - Direct text paste option

   - File progress tracking

   - Support for PDF, DOCX, PPTX, TXT, images

-90% working, right?

3. QuizCenter.tsx - Quiz interface

   - One question at a time

   - Multiple choice, true/false, short answer

   - Progress bar and navigation

   - Basic results screen

This works without teacher layer - varied tests with questions that are not rote, but analytical - or is it working and I am missing something?

Technical Features

- Multi-format extraction

  - PDF parsing (pdf.js)

  - DOCX parsing (Mammoth)

  - PPTX parsing (PizZip)

  - OCR for images (Tesseract.js)

This seems to be working pretty well although I didn’t try images yet…

- Database architecture

  - Supabase PostgreSQL setup

  - Tables: subjects, study_materials, uploaded_materials, quiz_questions

  - Edge function: process-upload

It seems like you have most of this, right?

- AI Quiz Generation

  - OpenAI GPT-4o-mini integration

  - Teacher-aligned prompt system (from provided code)

  - Question types: multiple_choice, true_false, short_answer, cloze

  - Cognitive mix: knowledge (25%), understanding (35%), application (40%)

  - Difficulty mix: easy (20%), medium (60%), hard (20%)

- Deployment

  - Frontend: Vercel deployment

  - Backend: Supabase edge functions

  - Domain: Namecheap DNS configuration

  - Environment: Production and preview environments

This maybe 20%?

Success Criteria

- PDF, DOCX, and JPG uploads extract text correctly

- Text saves to Supabase (study_materials table)

- Quiz generation uses uploaded material

- UI shows correct storage usage

- Functional on www.passai.study domain

Error handling and user feedback (toasts)

Not sure how much you’ve done with this one….

—

Phase 2: Analytics & Growth Garden (Q1 2026)

(I would like to do some of this in Phase 1)

Objective

Build trust through transparent analytics and replace traditional gamification with psychological engagement (Growth Garden).

User Interface Deliverables

1. Enhanced SubjectOverview.tsx

   - Pass probability display (Bayesian inference)

   - Garden Health visualization

   - Days until test countdown

   - Daily study time tracker

   - Quiz completion progress

The UI is there for a few of these, but doesn't seem to be functional.

2. StudyPlanOverview.jsx - Daily study view

   - Current pass probability

   - 3 specific next steps

   - Weak areas identification

   - Garden health integration

   - Last studied timestamp

3. GeneratedPlanDetail.jsx - Detailed projections

   - Current vs. projected pass probability

   - Expected score calculation

   - Week-by-week study schedule

   - Skill-by-skill before/after analysis

   - PassAI recommendations with logo

Technical Features

- Bayesian Knowledge Tracking

  - Per-skill mastery probability (p_k)

  - Forgetting curves (exponential decay)

  - Knowledge state updates after each quiz

  - Parameters: slip (0.10), guess (0.20), learn (0.20)

- Growth Garden System

  - Level and points tracking

  - Health percentage (0-100)

  - Last tended timestamp

  - No punitive "streak breaking"

  - Visual states: Thriving → Healthy → Needs Tending → Resting

- Analytics Dashboard

  - Per-subject accuracy tracking

  - Topic weakness identification

  - Quiz attempt history

  - Study consistency (7-day rolling)

  - Progress charts (Recharts library)

- Database Schema Updates

  - skills table (mastery, weight, half_life)

  - plant_states table (level, points, health)

  - quiz_attempts table (responses, timestamps)

  - study_plans table (recommendations)

Success Criteria

- Pass probability calculation working (Bayesian)

- Garden Health updates after quiz completion

- Study plan generates personalized recommendations

- Analytics dashboard shows accurate weak areas

- Users can see progress over time

I am aware how much you’ve done and how you have taken it apart and put it back together again

Option 1

-Immediate payment: $100 + an additional $100 “thank you bonus” = $200 total - this includes getting a functional phase one model.

-If PassAI needs future updates, we can discuss new development phases together, possibly with either higher fixed fees or future revenue-share

Option 2

-Immediate payment: $100 + an additional $200 “recognition bonus” = $300 total (paid at once or in 2 parts if needed - but this would also get us to a functional test model)

-Future: 1% of PassAI’s net revenue (paid if the product earns money)

-Applies only if you continue to help with improvements, bug fixes, or scaling - so phase 2-3-4 app and website

-If PassAI ever secures investment, this 1% revenue share can be converted to 1% equity

Option 3

-Immediate payment: $100 now (as agreed), plus an additional $100 later, split into two $50 payments over the next two months (or according to an agreed schedule).

-Plus: A slightly higher future profit share of 2% of PassAI’s net revenue, but only as long as you continues to contribute actively to updates, fixes, or new features.

-If PassAI gets investment, this 2% revenue share can be converted into 1% equity (if you are ready for equity distribution).

————————————

So, in essence, you have done some really good work, and I am grateful, and I am aware that you have rebuilt the app from the bottom up... so I am aware... we still have a long way to go and I’d like to keep you on. But I also really need to get moving with this…

If you would also like to have monthly salary of 50$ I can reconfigure these options. Let me know and I’ll have some contracts drawn up and we can start setting some timelines. What do you think?

Let me know.

-Erik
