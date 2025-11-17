# BKT Integration - Future Enhancements

**Status:** Phase 1 Complete (95%)  
**Date:** November 17, 2025

---

## ✅ What's Complete

1. **BKT Algorithm Migration**

   - `study/utils/bkt.ts` - Pure BKT implementation
   - `study/services/mastery.service.ts` - Mastery tracking service
   - `study/types/analytics.types.ts` - Type definitions

2. **Quiz Integration**

   - Concept field added to quiz generation
   - Mastery updates after quiz completion
   - Pass probability calculation

3. **UI Components**

   - PassProbabilityCard (Subject Detail + Dashboard)
   - TopicMasteryCard (detailed breakdown)
   - WeakAreasCard (priority-based weak areas)

4. **Data Flow**
   - Quiz completion → Concept extraction → BKT update → Pass probability → UI display

---

## 🔮 Future Enhancements (Backlog)

### 1. Historical Mastery Tracking

**Priority:** Medium  
**Estimated Time:** 2 days

**Description:**  
Track P(Known) changes over time to show improvement graphs.

**Implementation:**

- Add `mastery_history` table with timestamp, topic, p_known
- Store snapshot after each quiz
- Create line chart showing mastery improvement
- Display on Subject Detail Page as "Progress Over Time"

**Benefits:**

- Visual motivation for students
- Identify stagnant topics
- Prove learning effectiveness

---

### 2. Adaptive Difficulty

**Priority:** High  
**Estimated Time:** 3 days

**Description:**  
Use BKT mastery levels to dynamically adjust question difficulty.

**Implementation:**

```typescript
// In quiz generation
const weakTopics = await getWeakTopics(subjectId, threshold: 40);
const strongTopics = await getStrongTopics(subjectId, threshold: 80);

const difficultyDistribution = {
  easy: weakTopics.length > 3 ? 60 : 30,    // More easy if struggling
  medium: 30,
  hard: weakTopics.length > 3 ? 10 : 40     // More hard if doing well
};
```

**Benefits:**

- Prevents frustration (fewer hard questions if struggling)
- Prevents boredom (more hard questions if mastering)
- Optimal learning zone (Vygotsky's ZPD)

---

### 3. Concept Clustering

**Priority:** Medium  
**Estimated Time:** 2 days

**Description:**  
Group related concepts for better weak area identification.

**Implementation:**

- Define concept hierarchies per subject
  ```typescript
  const conceptHierarchy = {
    Calculus: {
      parent: "Mathematics",
      children: ["Derivatives", "Integrals", "Limits"],
    },
  };
  ```
- Aggregate mastery at parent level
- Show "You're struggling with Calculus (3 sub-concepts weak)"

**Benefits:**

- Clearer weak area identification
- Better study recommendations
- Reduced cognitive load

---

### 4. Mastery Decay (Spaced Repetition)

**Priority:** High  
**Estimated Time:** 3-4 days

**Description:**  
Reduce mastery over time if topic not practiced (forgetting curve).

**Implementation:**

```typescript
function calculateDecay(lastPracticed: Date, currentMastery: number) {
  const daysSince =
    (Date.now() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24);
  const decayRate = 0.02; // 2% per day
  const decay = Math.min(daysSince * decayRate, 0.5); // Max 50% decay
  return Math.max(currentMastery - decay, 0.1); // Min 10%
}
```

**Schedule Review:**

- Low mastery (20-40%): Review in 1 day
- Medium mastery (40-60%): Review in 3 days
- High mastery (60-80%): Review in 7 days
- Mastered (80%+): Review in 14 days

**Benefits:**

- Scientifically proven spaced repetition
- Optimal review timing
- Long-term retention

---

### 5. Custom BKT Parameters

**Priority:** Low  
**Estimated Time:** 2 days

**Description:**  
Allow tuning BKT parameters per subject or user learning style.

**Implementation:**

- Add `bkt_parameters` table
  ```sql
  CREATE TABLE bkt_parameters (
    subject_id UUID REFERENCES subjects(id),
    p_learn DECIMAL DEFAULT 0.1,
    p_guess DECIMAL DEFAULT 0.25,
    p_slip DECIMAL DEFAULT 0.1,
    notes TEXT
  );
  ```
- Detect learning patterns automatically
  - Fast learner: Increase P(T) to 0.15
  - Careful student: Decrease P(S) to 0.05
  - Lucky guesser: Decrease P(G) to 0.15

**Benefits:**

- Personalized to learning style
- More accurate mastery estimates
- Advanced feature for power users

---

### 6. BKT Confidence Intervals

**Priority:** Low  
**Estimated Time:** 1-2 days

**Description:**  
Show confidence ranges for mastery estimates.

**Implementation:**

```typescript
interface MasteryWithConfidence {
  mastery: number;
  confidenceMin: number; // 95% CI lower bound
  confidenceMax: number; // 95% CI upper bound
  sampleSize: number; // Number of questions attempted
}
```

**Display:**

- "Mastery: 65% ± 10%"
- "Complete 5 more questions for better accuracy"

**Benefits:**

- Transparency about estimate quality
- Encourages more practice
- Scientifically rigorous

---

### 7. Multi-Concept Questions

**Priority:** Medium  
**Estimated Time:** 2 days

**Description:**  
Handle questions that test multiple concepts simultaneously.

**Implementation:**

- Allow `concepts: string[]` instead of single `concept`
- Update mastery for all concepts when question answered
- Weight contribution based on concept difficulty

**Example:**

```typescript
// Question tests both "Stoichiometry" and "Gas Laws"
const concepts = ["Stoichiometry", "Gas Laws"];
const weight = 1 / concepts.length; // 50% each

for (const concept of concepts) {
  await updateTopicMastery(subjectId, concept, isCorrect, weight);
}
```

**Benefits:**

- More accurate for complex questions
- Better represents real exam questions
- Improved mastery tracking

---

### 8. Bayesian Network Visualization

**Priority:** Low (Phase 2+)  
**Estimated Time:** 4-5 days

**Description:**  
Visual graph showing concept dependencies and mastery flow.

**Implementation:**

- D3.js or React Flow graph
- Nodes = concepts (colored by mastery)
- Edges = dependencies (e.g., "Derivatives" → "Integrals")
- Interactive: Click node to see details

**Benefits:**

- Beautiful visualization
- Shows learning path
- Identifies prerequisite gaps

---

## 🧪 Testing Checklist (Before v1.0 Launch)

- [ ] **End-to-End Flow**

  - [ ] Upload material
  - [ ] Generate quiz with concepts
  - [ ] Complete quiz
  - [ ] Verify topic_mastery updates
  - [ ] Verify pass_chance updates
  - [ ] Check UI displays correct data

- [ ] **Edge Cases**

  - [ ] Quiz with no concept field (fallback to topic)
  - [ ] First quiz attempt (initial mastery = 30%)
  - [ ] All correct answers (mastery approaches 100%)
  - [ ] All incorrect answers (mastery decreases)

- [ ] **Database Migration**

  - [ ] Run questions_concept_migration.sql
  - [ ] Verify concept field exists
  - [ ] Verify indexes created

- [ ] **Performance**
  - [ ] Mastery calculations don't block quiz submission
  - [ ] Dashboard loads pass probability quickly
  - [ ] Weak areas query optimized

---

## 📝 Notes

**Why Not Now?**

- BKT is at a solid, presentable state (95% complete)
- Core functionality working
- UI polished and intuitive
- Time to move to next differentiator (Teacher Layer)

**When to Revisit?**

- After Teacher Layer (#3) complete
- After Auto-Generate Quiz (#4) complete
- During Phase 1.5 refinement
- Based on user feedback from beta testing

**Dependencies:**

- Some features require more quiz attempt data
- Adaptive difficulty needs topic mastery history
- Spaced repetition needs study session tracking

---

**Status:** BKT Phase 1 Complete ✅  
**Next Focus:** Teacher Layer Quiz Generation 📚
