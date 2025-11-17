import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "@/features/subjects/services";
import type {
  CreateSubjectInput,
  UpdateSubjectInput,
  Subject,
  SubjectIcon,
  SubjectColor,
} from "@/features/subjects/types";
import {
  EXAM_BOARDS,
  QUESTION_STYLES,
  getRandomPreset,
} from "@/features/subjects/types";

// =============================================
// Types
// =============================================

interface SubjectFormProps {
  mode: "create" | "edit";
  subject?: Subject;
  onSubmit: (
    data: CreateSubjectInput | UpdateSubjectInput
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// =============================================
// Component
// =============================================

export default function SubjectForm({
  mode,
  subject,
  onSubmit,
  onCancel,
  isLoading = false,
}: SubjectFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-assign random color for new subjects, always use "book" icon
  const randomPreset = getRandomPreset();
  const selectedColor: SubjectColor =
    (subject?.color as SubjectColor) || (randomPreset.color as SubjectColor);

  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      isEditMode ? updateSubjectSchema : createSubjectSchema
    ),
    defaultValues:
      isEditMode && subject
        ? {
            name: subject.name,
            description: subject.description || "",
            test_date: subject.test_date || "",
            exam_board: subject.exam_board || "",
            teacher_emphasis: subject.teacher_emphasis || "",
            question_style: subject.question_style || "multiple_choice",
            grading_rubric: subject.grading_rubric || "",
          }
        : {
            question_style: "multiple_choice",
          },
  });

  const handleFormSubmit = async (data: FieldValues) => {
    setError(null);
    setSuccess(null);

    // Always use "book" icon, auto-assign color
    const submissionData = {
      ...data,
      icon: "book" as SubjectIcon,
      color: selectedColor,
      // Convert empty strings to null
      description: data.description || null,
      test_date: data.test_date || null,
      exam_board: data.exam_board || null,
      teacher_emphasis: data.teacher_emphasis || null,
      grading_rubric: data.grading_rubric || null,
      // Ensure question_style has a value
      question_style: data.question_style || "multiple_choice",
    };

    const result = await onSubmit(submissionData);

    if (result.success) {
      setSuccess(
        result.message ||
          `Subject ${isEditMode ? "updated" : "created"} successfully!`
      );
    } else {
      setError(
        result.error || `Failed to ${isEditMode ? "update" : "create"} subject`
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Edit Subject" : "Create New Subject"}
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Subject Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Subject Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all`}
            placeholder="e.g., Biology Midterm"
            disabled={isSubmitting || isLoading}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Description{" "}
            <span className="text-slate-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all resize-none`}
            placeholder="e.g., Chapters 1-5, focus on cell biology and genetics"
            disabled={isSubmitting || isLoading}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Test Date */}
        <div>
          <label
            htmlFor="test_date"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Test Date{" "}
            <span className="text-slate-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <input
            id="test_date"
            type="date"
            {...register("test_date")}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.test_date
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all`}
            disabled={isSubmitting || isLoading}
          />
          {errors.test_date && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.test_date.message}
            </p>
          )}
        </div>

        {/* Section Divider */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            📚 Curriculum Customization
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Help us generate questions that match your actual exam
          </p>
        </div>

        {/* Exam Board */}
        <div>
          <label
            htmlFor="exam_board"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Exam Board{" "}
            <span className="text-slate-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <select
            id="exam_board"
            {...register("exam_board")}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.exam_board
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all`}
            disabled={isSubmitting || isLoading}
          >
            <option value="">Select an exam board...</option>
            {EXAM_BOARDS.map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>
          {errors.exam_board && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.exam_board.message}
            </p>
          )}
        </div>

        {/* Teacher Emphasis */}
        <div>
          <label
            htmlFor="teacher_emphasis"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Teacher Emphasis{" "}
            <span className="text-slate-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <textarea
            id="teacher_emphasis"
            {...register("teacher_emphasis")}
            rows={2}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.teacher_emphasis
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all resize-none`}
            placeholder="e.g., Focus on essay structure and thesis statements"
            disabled={isSubmitting || isLoading}
          />
          {errors.teacher_emphasis && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.teacher_emphasis.message}
            </p>
          )}
        </div>

        {/* Question Style */}
        <div>
          <label
            htmlFor="question_style"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Question Format{" "}
            <span className="text-slate-400 text-xs font-normal">
              (how you'll be tested)
            </span>
          </label>
          <select
            id="question_style"
            {...register("question_style")}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.question_style
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all`}
            disabled={isSubmitting || isLoading}
          >
            {QUESTION_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label} - {style.description}
              </option>
            ))}
          </select>
          {errors.question_style && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.question_style.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">
            💡 This helps generate questions that match your actual exam format
          </p>
        </div>

        {/* Grading Rubric */}
        <div>
          <label
            htmlFor="grading_rubric"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Grading Rubric{" "}
            <span className="text-slate-400 text-xs font-normal">
              (optional)
            </span>
          </label>
          <textarea
            id="grading_rubric"
            {...register("grading_rubric")}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.grading_rubric
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            } focus:outline-none focus:ring-4 transition-all resize-none`}
            placeholder="e.g., 'Looks for specific vocabulary and clear explanations' or 'Wants step-by-step work shown' or 'Emphasizes thesis + 3 supporting points'"
            disabled={isSubmitting || isLoading}
          />
          {errors.grading_rubric && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.grading_rubric.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-500">
            📝 This helps generate answers that match your teacher's
            expectations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Subject"
            ) : (
              "Create Subject"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
