# Code Generation Guidelines

## Architecture Guidelines

- Use a modular, feature-based folder structure: `features/<domain>/<component|hooks|services|etc>`
- Use React with TypeScript, functional components only.
- Use Supabase as the backend with a clear separation:
  - `/lib/supabase` → client & auth helpers
  - `/features/.../services` → data functions/schemas
  - `/features/.../components` → UI-only components
- Never mix UI logic and data logic.

## React Best Practices

- Use hooks for logic, components for presentation.
- Prefer small reusable components over large ones.
- Do not leak Supabase queries directly into components. Always abstract into services.

## Data & Networking Principles

- All database calls go into `services`.
- Always return typed data using Zod schemas.
- Always implement loading + empty + error UI states.

## Code Quality Requirements

- ✅ **No `any` types** - Always use proper TypeScript types
- ✅ **Clean, readable code** - Self-documenting with clear names
- ✅ **Single Responsibility** - Each function/component does one thing
- ✅ **DRY (Don't Repeat Yourself)** - Extract reusable logic
- ✅ **Proper error handling** - Never fail silently
- Follow SOLID principles (adapted for React).
- Write code that is:
  - scalable
  - readable
  - one-responsibility per file
  - future-proof

### Component Guidelines

- ✅ Keep components **focused and small** (prefer 100-200 lines max)
- ✅ Separate **business logic** from **UI rendering**
- ✅ Use **composition** over complex components
- ✅ Make components **reusable** where it makes sense
- ✅ Use **TypeScript interfaces** for props

### State Management

- ✅ Use **React Query** for server state
- ✅ Use **React Context** for global UI state (auth, theme, etc.)
- ✅ Use **local useState** for component-specific state
- ✅ Consider **state machines** (XState) for complex flows

### File Organization

- ✅ **Feature-based structure** - Group by feature, not by type
- ✅ **Co-location** - Keep related files together
- ✅ **Clear naming** - Files named after their primary export

### Accessibility

- ✅ **Semantic HTML** - Use proper elements
- ✅ **ARIA labels** - For screen readers
- ✅ **Keyboard navigation** - All interactive elements accessible via keyboard
- ✅ **Color contrast** - WCAG AA minimum

We do have ShadCN and tailwindcss. We don't have to re-build components if we don't have to. We can just use from ShadCN. Just let me know which and I will add them using the CLI.

## Additional Rules

- Never create magic strings; extract constants.
- Avoid monolithic files; split into small modules.
- Always document complex functions and hooks.

## 📂 Dev Plan

### Phase 1: Foundation

Core infrastructure that everything else depends on:

- Authentication system
- Database schema
- Basic routing

### Phase 2: Core Features

Main functionality in order of dependencies:

1. Subject Management (required for everything else)
2. Material Upload & Management (required for quizzes)
3. Quiz Generation & Taking (core feature)

### Phase 3: Advanced Features

Features that enhance the core experience:

1. Analytics & Predictions
2. Study Plans
3. Gamification (Study Garden)

### Phase 4: Polish & Optimization

Final touches:

1. Error handling
2. Loading states
3. Mobile responsiveness
4. Performance optimization
