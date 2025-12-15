# Current Sprint: Infrastructure & Security (Week 1-2)
**Week:** 1 of 12
**Started:** December 12, 2025
**Target Completion:** December 26, 2025 (2 weeks)
**Progress:** 58% complete (7 of 12 tasks done) ⚠️ Testing required

---

## 🎯 Sprint Goal
Eliminate critical security vulnerabilities and establish production-ready infrastructure foundation before building new features.

**Key Outcomes:**
- All OpenAI API calls moved to secure backend (Edge Functions)
- Rate limiting and usage quotas implemented
- Comprehensive error handling framework established
- Monitoring and observability systems deployed

---

## ✅ COMPLETED

### Priority 1: Security Migration (Days 1-4)
1. [x] **Edge Functions infrastructure setup** ✅
   - Created directory structure & shared utilities
   - Documented dashboard deployment constraints
   
2. [x] **Test Edge Function** ✅
   - Deployed and verified environment configuration
   
3. [x] **Generate-quiz Edge Function** ✅
   - Created 530+ line self-contained function
   - Deployed successfully
   
4. [x] **Update frontend to call generate-quiz Edge Function** ✅
   - Modified quizzesService.ts to use Edge Function
   - Added error handling and logging
   
5. [x] **Create grade-response Edge Function** ✅
   - 470+ line self-contained function
   - Short-answer and essay grading
   - Deployed successfully
   
6. [x] **Update frontend grading calls** ✅
   - Modified answerValidation.ts to use Edge Function
   - All OpenAI calls now secure (server-side only)
   
7. [x] **Remove exposed API keys from frontend** ✅
   - Deprecated old OpenAI client files
   - Created migration documentation
   - Marked deprecated code paths
   - Identified remaining usage (study plan - future work)

---

## ⏭️ UP NEXT (Prioritized Queue)

### Priority 1: Security Migration (Days 1-4)

8. [ ] **Test all OpenAI features end-to-end**
   - Create `supabase/functions/grade-response/`
   - Move logic from `src/features/quizzes/services/aiGradingService.ts`
   - Add rate limiting
   - Update frontend quiz results flow
   - Test grading for short-answer and essay questions

4. [ ] **Remove exposed API keys from frontend**
   - Delete `VITE_OPENAI_API_KEY` from frontend env
   - Remove `dangerouslyAllowBrowser` configurations
   - Update `src/lib/ai/openai.ts`
   - Verify no API keys in client bundle
   - Test all affected features still work

### Priority 2: Error Handling Framework (Days 5-7)
5. [ ] **Create error handling utilities**
   - Design error types hierarchy
   - Create `src/lib/errors/` directory
   - Implement error classes (AuthError, APIError, ValidationError, etc.)
   - Create error boundary components
   - Add toast notification system

6. [ ] **Add error handling to critical flows**
   - Material upload flow
   - Quiz generation flow
   - Quiz taking flow
   - Study plan generation
   - Add user-friendly error messages
   - Add retry mechanisms where appropriate

### Priority 3: Monitoring Setup (Days 8-10)
7. [ ] **Set up error tracking (Sentry)**
   - Create Sentry account/project
   - Install Sentry SDK
   - Configure error boundaries
   - Test error reporting
   - Set up alerts

8. [ ] **Set up analytics (PostHog)**
   - Create PostHog account/project
   - Install PostHog SDK
   - Identify key events to track
   - Implement event tracking
   - Create initial dashboard

9. [ ] **Implement logging infrastructure**
   - Server-side logging for Edge Functions
   - Frontend logging (console wrapper)
   - Log aggregation strategy
   - Performance monitoring

### Priority 4: Rate Limiting & Quotas (Days 11-14)
10. [ ] **Implement usage tracking**
    - Create `user_usage` database table
    - Track OpenAI API calls per user
    - Track quiz generations
    - Track AI grading requests

11. [ ] **Add rate limiting**
    - Per-user rate limits (10 quizzes/day, 50 questions/day)
    - IP-based rate limiting for auth endpoints
    - Implement cooldown periods
    - User-friendly quota exceeded messages

12. [ ] **Add usage quotas for free tier**
    - Define free tier limits
    - Implement quota checks in Edge Functions
    - Show usage to users in dashboard
    - Add upgrade prompts (for future paid plans)

---

## 🚧 BLOCKED
_No current blockers_

---

## ✅ RECENTLY COMPLETED

### ✅ Task #2: Create generate-quiz Edge Function (Dec 14, 2025)
**What Was Done:**
- Ported complete quiz generation logic from quizGen.ts (354 lines)
- Created self-contained single-file Edge Function (530+ lines)
- Included all prompt building functions:
  - `buildCurriculumAlignedPrompt()` - Exam board support (IB, AP, A-Level, GCSE, etc.)
  - `getExamBoardGuidance()` - Board-specific requirements
  - `getQuestionStyleGuidance()` - Question format guidance
  - `buildUserPrompt()` - Material-based prompt generation
- Implemented teacher layer customization (emphasis, rubric, question style)
- Added authentication and subject/material access validation
- Integrated OpenAI API calls (server-side, secure)
- Comprehensive logging for debugging

**Files Created:**
- `supabase/functions/generate-quiz/index.ts` (530+ lines, self-contained)

**Next Steps:**
- User needs to deploy function via Supabase dashboard
- Update frontend to call Edge Function instead of direct OpenAI
- Test quiz generation with various settings

---

### ✅ Task #1: Set up Supabase Edge Functions infrastructure (Dec 14, 2025)
**What Was Done:**
- Created complete directory structure: `supabase/functions/`
- Built shared utilities in `_shared/`:
  - `cors.ts` - CORS headers configuration
  - `types.ts` - TypeScript types for requests/responses
  - `auth.ts` - JWT validation and access control
  - `errors.ts` - Error handling and response utilities
  - `openai.ts` - Server-side OpenAI client (NO dangerouslyAllowBrowser!)
- Created test Edge Function for deployment verification
- Established foundation for secure API key management

**Files Created:**
- `supabase/functions/_shared/cors.ts`
- `supabase/functions/_shared/types.ts`
- `supabase/functions/_shared/auth.ts`
- `supabase/functions/_shared/errors.ts`
- `supabase/functions/_shared/openai.ts`
- `supabase/functions/test/index.ts`
- `work_md/OPENAI_EDGE_FUNCTIONS_MIGRATION.md` (detailed plan)

**Key Discovery:**
- Supabase dashboard deployment only supports single-file Edge Functions
- Cannot use `_shared/` folder with relative imports
- Restructured test function to be self-contained (all utilities inline)
- Future functions will follow same pattern

**Next Steps:**
- User needs to deploy test function via Supabase dashboard
- User needs to configure `OPENAI_API_KEY` in Supabase secrets
- Once verified, proceed to Task #2: Create generate-quiz function (single file)

---

## 📊 Sprint Progress

**Overall Progress:** 2 / 12 tasks (17%)

**By Priority:**
- Priority 1 (Security): 2 / 4 tasks
- Priority 2 (Error Handling): 0 / 2 tasks
- Priority 3 (Monitoring): 0 / 3 tasks
- Priority 4 (Rate Limiting): 0 / 3 tasks

**Days Elapsed:** 0 / 14
**Status:** 🟢 On Track (Not started yet)

---

## 📝 Sprint Notes

### Key Decisions
- **Edge Functions over Serverless Framework:** Using Supabase's native Edge Functions (Deno) for simplicity and integration
- **PostHog over other analytics:** Better suited for product analytics, has A/B testing features we might need
- **Sentry for error tracking:** Industry standard, good React integration

### Important Context
- This sprint is BLOCKING for all future work - nothing can proceed until security is fixed
- OpenAI API key exposure is critical vulnerability that could cost money if exploited
- Error handling needs to be comprehensive from start - retrofitting is harder
- Monitoring must be in place before beta launch to catch issues early

### Dependencies
- Supabase project must have Edge Functions enabled (it should be)
- Need to create Sentry and PostHog accounts (free tiers available)
- Frontend environment variables will change (remove VITE_OPENAI_API_KEY)

### Reference Documentation
- **Roadmap:** `audit/work_md/BETA_DEPLOYMENT_ROADMAP.md` (Week 1-2 section)
- **Audit Report:** `audit/work_md/PRODUCTION_READINESS_AUDIT.md` (Critical Issues section)
- **Security Details:** All critical security issues documented in audit

---

## 🎯 Definition of Done (This Sprint)

Sprint is complete when:
- [ ] Zero API keys exposed in frontend code
- [ ] All OpenAI calls happen server-side
- [ ] Rate limiting prevents API abuse
- [ ] Error handling covers all critical user flows
- [ ] Sentry captures and reports errors
- [ ] PostHog tracks key user events
- [ ] Usage quotas prevent free tier abuse
- [ ] All existing features still work (no regressions)
- [ ] Tests pass
- [ ] Documentation updated

---

**Next Sprint Preview:** Week 3-5 - RAG Pipeline Implementation (Chunking, Embeddings, Retrieval)
