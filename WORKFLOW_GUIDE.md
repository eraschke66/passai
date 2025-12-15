# PassAI Development Workflow Guide
**Purpose:** Maintain consistent, trackable progress across all development sessions

---

## 🎯 Core Principles

1. **Always know where we are** - Check progress before starting
2. **Work in small iterations** - Complete one thing before moving to next
3. **Document as we go** - Update logs immediately after completing tasks
4. **Test before moving on** - Verify each change works
5. **Context for continuity** - Make it easy to resume in new chat

---

## 📋 The Three Essential Files

### 1. `CURRENT_SPRINT.md` (The Active Work File)
- **Purpose:** What we're working on RIGHT NOW
- **Location:** Root of project
- **Update:** Start of each session, after completing each task
- **Contains:** 
  - Current phase/week from roadmap
  - Active tasks (in-progress)
  - Blocked items
  - Next 3 tasks in queue

### 2. `PROGRESS_LOG.md` (The Historical Record)
- **Purpose:** Chronological log of everything completed
- **Location:** Root of project
- **Update:** Immediately after completing any task
- **Contains:**
  - Date-stamped entries
  - What was completed
  - Any issues encountered
  - Decisions made

### 3. `SESSION_HANDOFF.md` (The Context File)
- **Purpose:** Everything needed to start fresh in new chat
- **Location:** Root of project
- **Update:** At end of each session (or when chat gets long)
- **Contains:**
  - Current state summary
  - Open questions/blockers
  - Next immediate action
  - Key context (decisions, discoveries)

---

## 🔄 Standard Workflow (Every Session)

### START OF SESSION

```
1. READ CURRENT_SPRINT.md
   └─ What's the active task?
   └─ Any blockers noted?

2. CHECK PROGRESS_LOG.md (last 5 entries)
   └─ What was last completed?
   └─ Any context I need to know?

3. REVIEW SESSION_HANDOFF.md
   └─ Any special context from last session?
   └─ Were there open questions?

4. CONFIRM PLAN
   └─ State what we're about to work on
   └─ Get user confirmation
   └─ Update CURRENT_SPRINT.md if needed
```

### DURING WORK

```
FOR EACH TASK:
1. UPDATE CURRENT_SPRINT.md
   └─ Mark task as "🔄 IN PROGRESS"

2. DO THE WORK
   └─ Make changes
   └─ Test locally
   └─ Verify it works

3. DOCUMENT COMPLETION
   └─ Update PROGRESS_LOG.md with entry
   └─ Mark task "✅ COMPLETE" in CURRENT_SPRINT.md
   └─ Move to next task

4. COMMIT OFTEN
   └─ Small, focused commits
   └─ Clear commit messages
```

### END OF SESSION

```
1. UPDATE SESSION_HANDOFF.md
   └─ Summarize what was completed today
   └─ Note any blockers or open questions
   └─ State the NEXT IMMEDIATE ACTION clearly

2. UPDATE CURRENT_SPRINT.md
   └─ Move completed tasks to "Recently Completed"
   └─ Pull next tasks from roadmap into "Up Next"

3. FINAL CHECK
   └─ All changes committed?
   └─ All files updated?
   └─ Clear what to do next?
```

---

## 📝 File Templates & Standards

### CURRENT_SPRINT.md Format

```markdown
# Current Sprint: [Phase Name]
**Week:** [X of 12]
**Started:** [Date]
**Target Completion:** [Date]

## 🎯 Sprint Goal
[1-2 sentence description of what we're achieving this week]

## 🔄 IN PROGRESS
- [ ] Task name (Started: Dec 12)
  - Context: [Any important details]
  - Branch: [branch-name]
  - Status: [specific state like "testing", "debugging", etc.]

## ⏭️ UP NEXT (Next 3 Tasks)
1. [ ] Task name
2. [ ] Task name  
3. [ ] Task name

## 🚧 BLOCKED
- [ ] Task name - Blocked by: [reason]

## ✅ RECENTLY COMPLETED (Last 5)
1. ✅ Task name (Completed: Dec 12)
2. ✅ Task name (Completed: Dec 11)
3. ...

## 📊 Sprint Progress
- Tasks Completed: X / Y
- Days Elapsed: X / 7-14
- Status: [On Track / At Risk / Behind]

## 📝 Notes
- [Any important observations or decisions]
```

### PROGRESS_LOG.md Format

```markdown
# PassAI Progress Log
**Purpose:** Chronological record of all completed work

---

## December 12, 2025

### ✅ [Task Name] - [Time]
**Branch:** [branch-name]
**Files Changed:** 
- path/to/file1.ts
- path/to/file2.ts

**What Was Done:**
- Specific change 1
- Specific change 2

**Testing:**
- Tested scenario X
- Verified output Y

**Notes:**
- Any gotchas or important context

---

## December 11, 2025
[Previous entries...]
```

### SESSION_HANDOFF.md Format

```markdown
# Session Handoff
**Last Updated:** [Date & Time]
**Session:** [Session number or identifier]

---

## 🎯 Current State

**Active Phase:** Week X - [Phase Name]
**Current Task:** [Specific task in progress]
**Status:** [Percentage complete or state]

## ✅ Completed This Session
1. Task 1 - [brief description]
2. Task 2 - [brief description]

## 🚧 Open Issues / Blockers
- [ ] Issue 1 - [description and impact]
- [ ] Issue 2 - [description and impact]

## 🔍 Important Context
- **Decision:** [Any architectural or approach decisions made]
- **Discovery:** [Anything learned that's important]
- **Change:** [Any pivots or changes to plan]

## ⏭️ NEXT IMMEDIATE ACTION
**When resuming work, do this first:**
[Clear, specific instruction like "Implement the chunking Edge Function in supabase/functions/chunk-material/"]

**Why:** [Brief context on why this is next]

**Files to Reference:**
- path/to/relevant/file1.ts
- path/to/relevant/file2.ts

## 📋 Handoff Checklist
- [ ] All code committed and pushed
- [ ] CURRENT_SPRINT.md updated
- [ ] PROGRESS_LOG.md has today's entries
- [ ] Tests passing locally
- [ ] Clear next action documented above
```

---

## 🎨 Task Status Conventions

Use these emoji consistently across all files:

- 🔄 **IN PROGRESS** - Currently being worked on
- ⏭️ **UP NEXT** - Ready to start, not started
- 🚧 **BLOCKED** - Cannot proceed, needs resolution
- ✅ **COMPLETE** - Done and verified
- ⏸️ **PAUSED** - Started but deprioritized
- ❌ **CANCELLED** - No longer needed
- 🔍 **INVESTIGATING** - Research/exploration phase
- 🧪 **TESTING** - Implementation done, verifying

---

## 🔄 Weekly Sprint Cycle

```
MONDAY (Week Start)
├─ Review last week's completion
├─ Pull this week's tasks from BETA_DEPLOYMENT_ROADMAP.md
├─ Update CURRENT_SPRINT.md with week's goals
└─ Start first task

TUESDAY-THURSDAY (Active Development)
├─ Work through task list
├─ Update logs after each task
├─ Test continuously
└─ Commit frequently

FRIDAY (Week End / Review)
├─ Complete any remaining tasks
├─ Test integrated changes
├─ Update documentation
├─ Plan next week
└─ Update SESSION_HANDOFF.md

WEEKEND (Optional)
└─ Review progress, plan ahead
```

---

## 🆘 When Things Go Wrong

### If You Get Stuck
1. Document the blocker in CURRENT_SPRINT.md
2. Note what you've tried in PROGRESS_LOG.md
3. Move to next unblocked task if possible
4. Update SESSION_HANDOFF.md with details

### If Chat Gets Too Long
1. Complete current task or reach good stopping point
2. Update all three tracking files
3. Create detailed SESSION_HANDOFF.md
4. Start new chat with: "I'm continuing PassAI development. Please read SESSION_HANDOFF.md, CURRENT_SPRINT.md, and the last 3 entries in PROGRESS_LOG.md to understand context."

### If You Need to Pivot
1. Document the reason in PROGRESS_LOG.md
2. Update CURRENT_SPRINT.md with new direction
3. Note the change in SESSION_HANDOFF.md
4. Proceed with new plan

---

## 📏 Quality Standards

Before marking ANY task as complete:

✅ **Code Quality**
- [ ] TypeScript types defined
- [ ] No console.log statements (use proper logging)
- [ ] Error handling implemented
- [ ] Comments for complex logic

✅ **Testing**
- [ ] Tested happy path
- [ ] Tested error cases
- [ ] Verified in UI (if applicable)
- [ ] No regression in other features

✅ **Documentation**
- [ ] PROGRESS_LOG.md updated
- [ ] CURRENT_SPRINT.md updated
- [ ] Code comments added where needed
- [ ] README updated if needed

---

## 🎯 Success Metrics

Track these weekly in CURRENT_SPRINT.md:

- **Velocity:** Tasks completed per day
- **Quality:** Bugs introduced vs fixed
- **Blockers:** How quickly resolved
- **Coverage:** % of roadmap completed

---

## 🚀 Quick Reference Commands

```bash
# Start new session
1. Read CURRENT_SPRINT.md
2. Read last 3 PROGRESS_LOG.md entries
3. Read SESSION_HANDOFF.md
4. Confirm plan with user

# Complete a task
1. Update CURRENT_SPRINT.md (mark in progress)
2. Do the work
3. Test it
4. Update PROGRESS_LOG.md (new entry)
5. Update CURRENT_SPRINT.md (mark complete)
6. Commit changes

# End session
1. Complete current task OR reach good stopping point
2. Update SESSION_HANDOFF.md
3. Update CURRENT_SPRINT.md
4. Verify all changes committed
```

---

**Remember:** The goal is to make progress trackable, resumable, and predictable. These files are your navigation system through the 12-week roadmap.

**If ever in doubt:** Update the files. When in question, over-communicate in the logs.
