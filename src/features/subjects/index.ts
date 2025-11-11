// Barrel export for subjects feature
// Types and constants
export * from "./types";

// Services (schemas re-exported from types, so we only export functions)
export {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateLastStudied,
  updateSubjectStats,
} from "./services/subjectService";

// Schemas
export {
  createSubjectSchema,
  updateSubjectSchema,
  deleteSubjectSchema,
  subjectQuerySchema,
} from "./services/schemas";

// Utilities
export * from "./utils";

// Hooks
export * from "./hooks";

// Components
export * from "./components";

// Pages
export { default as SubjectsPage } from "./pages/SubjectsPage";
export { default as SubjectDetailPage } from "./pages/SubjectDetailPage";
