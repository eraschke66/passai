import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Brain,
  TrendingUp,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import {
  useSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "../hooks/useSubjects";
import SubjectForm from "../components/SubjectForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import {
  calculateDaysUntilTest,
  isTestSoon,
  isTestPast,
  getSubjectIcon,
  getSubjectColorClasses,
} from "../utils";
import type { Subject, UpdateSubjectInput } from "../types/subject.types";

type ModalState =
  | { type: "closed" }
  | { type: "edit"; subject: Subject }
  | { type: "delete"; subject: Subject };

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  // Queries
  const { data: subject, isLoading, isError, error } = useSubject(id);

  // Mutations
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  // Handlers
  const handleBack = () => {
    navigate("/subjects");
  };

  const handleOpenEdit = () => {
    if (subject) {
      setModalState({ type: "edit", subject });
    }
  };

  const handleOpenDelete = () => {
    if (subject) {
      setModalState({ type: "delete", subject });
    }
  };

  const handleCloseModal = () => {
    setModalState({ type: "closed" });
  };

  const handleUpdateSubject = async (input: UpdateSubjectInput) => {
    if (modalState.type !== "edit") {
      return { success: false, error: "Invalid modal state" };
    }
    try {
      await updateMutation.mutateAsync({
        id: modalState.subject.id,
        input,
      });
      handleCloseModal();
      return { success: true, message: "Subject updated successfully!" };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update subject",
      };
    }
  };

  const handleDeleteSubject = async () => {
    if (modalState.type !== "delete") return;
    try {
      await deleteMutation.mutateAsync(modalState.subject.id);
      navigate("/subjects");
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6 h-10 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 h-32 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !subject) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back to Subjects
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">
                Failed to load subject
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error?.message || "Subject not found"}
              </p>
              <button
                onClick={handleBack}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Back to Subjects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get icon and color
  const IconComponent = getSubjectIcon(subject.icon);
  const colorClasses = getSubjectColorClasses(subject.color);

  // Calculate test date info
  const daysUntil = subject.test_date
    ? calculateDaysUntilTest(subject.test_date)
    : null;
  const testIsSoon = subject.test_date ? isTestSoon(subject.test_date) : false;
  const testHasPassed = subject.test_date
    ? isTestPast(subject.test_date)
    : false;

  return (
    <>
      <div className="mx-auto max-w-6xl p-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="size-4" />
          Back to Subjects
        </button>

        {/* Header Card */}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className={`h-24 ${colorClasses.bgGradient}`} />
          <div className="relative px-6 pb-6">
            {/* Icon */}
            <div className="absolute -top-12 flex size-24 items-center justify-center rounded-xl border-4 border-white bg-white shadow-lg">
              <IconComponent className={`size-12 ${colorClasses.text}`} />
            </div>

            {/* Content */}
            <div className="ml-32 flex items-start justify-between pt-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {subject.name}
                </h1>
                {subject.description && (
                  <p className="mt-2 text-gray-600">{subject.description}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  {subject.exam_board && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <BookOpen className="size-4" />
                      <span>{subject.exam_board}</span>
                    </div>
                  )}
                  {subject.test_date && (
                    <div
                      className={`flex items-center gap-1.5 ${
                        testHasPassed
                          ? "text-gray-500"
                          : testIsSoon
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      <Calendar className="size-4" />
                      <span>
                        {new Date(subject.test_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                        {daysUntil !== null && (
                          <span className="ml-1">
                            ({testHasPassed ? "Passed" : `${daysUntil}d left`})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {subject.last_studied_at && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="size-4" />
                      <span>
                        Last studied{" "}
                        {new Date(subject.last_studied_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={handleOpenDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          {/* Progress */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Overall Progress
              </span>
              <TrendingUp className="size-5 text-blue-600" />
            </div>
            <div className="mb-2 text-3xl font-bold text-gray-900">
              {subject.progress}%
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full ${colorClasses.progressBar} transition-all`}
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>

          {/* Pass Chance */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Pass Chance
              </span>
              <Target className="size-5 text-green-600" />
            </div>
            <div className="mb-2 text-3xl font-bold text-gray-900">
              {subject.pass_chance}%
            </div>
            <p className="text-xs text-gray-500">
              Based on your current performance
            </p>
          </div>

          {/* Materials Count (Placeholder) */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Study Materials
              </span>
              <FileText className="size-5 text-purple-600" />
            </div>
            <div className="mb-2 text-3xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500">
              Upload materials to get started
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Materials Section - Empty State */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <FileText className="size-6 text-purple-600" />
                Study Materials
              </h2>
            </div>
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-50">
                  <FileText className="size-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No materials yet
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Upload study materials like PDFs, notes, and documents to get
                  started
                </p>
                <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                  Upload Materials
                </button>
              </div>
            </div>
          </div>

          {/* Quizzes Section - Empty State */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Brain className="size-6 text-blue-600" />
                Quizzes
              </h2>
            </div>
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50">
                  <Brain className="size-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No quizzes yet
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Generate AI-powered quizzes from your materials to test your
                  knowledge
                </p>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Generate Quiz
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Emphasis Section */}
        {subject.teacher_emphasis && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-amber-900">
              <Target className="size-5" />
              Teacher Emphasis
            </h3>
            <p className="text-amber-800">{subject.teacher_emphasis}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modalState.type === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <SubjectForm
              mode="edit"
              subject={modalState.subject}
              onSubmit={handleUpdateSubject}
              onCancel={handleCloseModal}
              isLoading={updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalState.type === "delete" && (
        <DeleteConfirmationModal
          subject={modalState.subject}
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleDeleteSubject}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}
