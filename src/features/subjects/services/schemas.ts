import { z } from "zod";
import {
  SUBJECT_ICONS,
  SUBJECT_COLORS,
  SUBJECT_LIMITS,
} from "../types/constants";

// =============================================
// Validation Schemas
// =============================================

/**
 * Schema for creating a new subject
 */
export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(SUBJECT_LIMITS.NAME_MIN_LENGTH, "Subject name is required")
    .max(
      SUBJECT_LIMITS.NAME_MAX_LENGTH,
      `Subject name must be less than ${SUBJECT_LIMITS.NAME_MAX_LENGTH} characters`
    )
    .trim(),

  description: z
    .string()
    .max(
      SUBJECT_LIMITS.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${SUBJECT_LIMITS.DESCRIPTION_MAX_LENGTH} characters`
    )
    .trim()
    .nullable()
    .optional(),

  test_date: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // null/undefined is valid
        const testDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        return testDate >= today;
      },
      { message: "Test date must be today or in the future" }
    )
    .nullable()
    .optional(),

  exam_board: z
    .string()
    .max(
      SUBJECT_LIMITS.EXAM_BOARD_MAX_LENGTH,
      `Exam board must be less than ${SUBJECT_LIMITS.EXAM_BOARD_MAX_LENGTH} characters`
    )
    .trim()
    .nullable()
    .optional(),

  teacher_emphasis: z
    .string()
    .max(
      SUBJECT_LIMITS.TEACHER_EMPHASIS_MAX_LENGTH,
      `Teacher emphasis must be less than ${SUBJECT_LIMITS.TEACHER_EMPHASIS_MAX_LENGTH} characters`
    )
    .trim()
    .nullable()
    .optional(),

  icon: z.enum(SUBJECT_ICONS as unknown as [string, ...string[]]).optional(),

  color: z.enum(SUBJECT_COLORS as unknown as [string, ...string[]]).optional(),
});

/**
 * Schema for updating an existing subject
 * All fields are optional since user may only want to update specific fields
 */
export const updateSubjectSchema = z
  .object({
    name: z
      .string()
      .min(SUBJECT_LIMITS.NAME_MIN_LENGTH, "Subject name is required")
      .max(
        SUBJECT_LIMITS.NAME_MAX_LENGTH,
        `Subject name must be less than ${SUBJECT_LIMITS.NAME_MAX_LENGTH} characters`
      )
      .trim()
      .optional(),

    description: z
      .string()
      .max(
        SUBJECT_LIMITS.DESCRIPTION_MAX_LENGTH,
        `Description must be less than ${SUBJECT_LIMITS.DESCRIPTION_MAX_LENGTH} characters`
      )
      .trim()
      .nullable()
      .optional(),

    test_date: z
      .string()
      .refine(
        (date) => {
          if (!date) return true; // null/undefined is valid
          const testDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return testDate >= today;
        },
        { message: "Test date must be today or in the future" }
      )
      .nullable()
      .optional(),

    exam_board: z
      .string()
      .max(
        SUBJECT_LIMITS.EXAM_BOARD_MAX_LENGTH,
        `Exam board must be less than ${SUBJECT_LIMITS.EXAM_BOARD_MAX_LENGTH} characters`
      )
      .trim()
      .nullable()
      .optional(),

    teacher_emphasis: z
      .string()
      .max(
        SUBJECT_LIMITS.TEACHER_EMPHASIS_MAX_LENGTH,
        `Teacher emphasis must be less than ${SUBJECT_LIMITS.TEACHER_EMPHASIS_MAX_LENGTH} characters`
      )
      .trim()
      .nullable()
      .optional(),

    icon: z.enum(SUBJECT_ICONS as unknown as [string, ...string[]]).optional(),

    color: z
      .enum(SUBJECT_COLORS as unknown as [string, ...string[]])
      .optional(),

    progress: z
      .number()
      .int()
      .min(0, "Progress must be at least 0")
      .max(100, "Progress must be at most 100")
      .optional(),

    pass_chance: z
      .number()
      .int()
      .min(0, "Pass chance must be at least 0")
      .max(100, "Pass chance must be at most 100")
      .nullable()
      .optional(),

    last_studied_at: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Schema for delete confirmation (requires typing subject name)
 */
export const deleteSubjectSchema = z
  .object({
    confirmName: z
      .string()
      .min(1, "Please enter the subject name to confirm deletion"),
    subjectName: z.string(),
  })
  .refine((data) => data.confirmName === data.subjectName, {
    message: "Subject name does not match",
    path: ["confirmName"],
  });

/**
 * Schema for query/filter options
 */
export const subjectQuerySchema = z.object({
  sortBy: z
    .enum(["test_date", "created_at", "updated_at", "name", "progress"])
    .optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),

  search: z.string().trim().optional(),

  hasTestDate: z.boolean().optional(),

  isActive: z.boolean().optional(),

  isArchived: z.boolean().optional(),
});

// =============================================
// Type Exports (inferred from schemas)
// =============================================

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type DeleteSubjectInput = z.infer<typeof deleteSubjectSchema>;
export type SubjectQueryInput = z.infer<typeof subjectQuerySchema>;
