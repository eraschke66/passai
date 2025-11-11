📋 Subject Management - Sub-Phase Breakdown
Based on the requirements and following our clean architecture principles, here's how I propose we split this:

Sub-Phase 2.1: Database Schema & Services ✅ Foundation
Create subjects table with all fields in Supabase
Set up RLS policies for user-specific access
Build typed service layer with Zod schemas
Create CRUD operations (create, read, update, delete)
Test database connectivity
Deliverables: Working database, type-safe service functions, no UI yet

Sub-Phase 2.2: Core Subject Components 🎨 Basic UI
Create Subject card component (reusable)
Create empty state component
Build "Create Subject" form with validation
Build "Edit Subject" form (reuse create form logic)
Create delete confirmation modal
Deliverables: Reusable UI components, ready to integrate

Sub-Phase 2.3: Subjects List Page 📋 Main View
Build subjects list/grid page
Implement fetching with React Query
Add loading and error states
Connect create/edit/delete actions
Display subject cards with all data
Deliverables: Fully functional subjects page where users can view and manage all subjects

Sub-Phase 2.4: Subject Detail Page 🔍 Deep Dive
Create subject detail page layout
Display subject information
Show empty states for materials and quizzes (we'll fill these later)
Add navigation and routing
Show basic progress placeholder
Deliverables: Individual subject view page, ready for materials/quizzes integration

Sub-Phase 2.5: Sorting, Filtering & Search 🔎 Enhancement
Implement client-side search
Add sort functionality (date, name, progress)
Add filter options (active, archived, all)
Build filter/sort UI controls
Add view toggle (grid/list)
Deliverables: Enhanced UX with search, sort, and filter capabilities

Sub-Phase 2.6: Progress Calculation & Polish ✨ Intelligence
Implement progress calculation logic
Add pass chance placeholder calculation
Implement countdown timer for test dates
Add visual indicators (colors, badges)
Polish animations and transitions
Mobile responsiveness check
Deliverables: Smart features working, polished UI, production-ready

🎯 Recommended Approach
I suggest we tackle these in order since each builds on the previous:

Start with 2.1 (Database & Services) - Foundation must be solid
Then 2.2 (Components) - Build our UI building blocks
Then 2.3 (List Page) - Main user interface
Then 2.4 (Detail Page) - Deep dive view
Then 2.5 (Search/Filter) - Enhanced UX
Finally 2.6 (Calculations & Polish) - Smart features and final touches
Each sub-phase is self-contained and testable on its own
