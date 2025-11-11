import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, AlertCircle } from "lucide-react";
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "../hooks/useSubjects";
import SubjectCard from "../components/SubjectCard";
import SubjectListItem from "../components/SubjectListItem";
import EmptyState from "../components/EmptyState";
import SubjectForm from "../components/SubjectForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import SubjectsToolbar from "../components/SubjectsToolbar";
import {
  filterBySearch,
  filterByStatus,
  sortSubjects,
  type SortOption,
  type FilterOption,
  type ViewMode,
} from "../utils/filterSort";
import type {
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../types/subject.types";

type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; subject: Subject }
  | { type: "delete"; subject: Subject };

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Queries
  const { data: subjects, isLoading, isError, error } = useSubjects();

  // Mutations
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  // Handlers
  const handleOpenCreate = () => {
    setModalState({ type: "create" });
  };

  const handleOpenEdit = (subject: Subject) => {
    setModalState({ type: "edit", subject });
  };

  const handleOpenDelete = (subject: Subject) => {
    setModalState({ type: "delete", subject });
  };

  const handleCloseModal = () => {
    setModalState({ type: "closed" });
  };

  const handleCreateSubject = async (
    input: CreateSubjectInput | UpdateSubjectInput
  ) => {
    try {
      await createMutation.mutateAsync(input as CreateSubjectInput);
      handleCloseModal();
      return { success: true, message: "Subject created successfully!" };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create subject",
      };
    }
  };

  const handleUpdateSubject = async (
    input: CreateSubjectInput | UpdateSubjectInput
  ) => {
    if (modalState.type !== "edit") {
      return { success: false, error: "Invalid modal state" };
    }
    try {
      await updateMutation.mutateAsync({
        id: modalState.subject.id,
        input: input as UpdateSubjectInput,
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
    await deleteMutation.mutateAsync(modalState.subject.id);
    handleCloseModal();
  };

  const handleCardClick = (subjectId: string) => {
    navigate(`/subjects/${subjectId}`);
  };

  // Apply filters, search, and sort
  const filteredAndSortedSubjects = useMemo(() => {
    if (!subjects) return [];

    let result = subjects;

    // Apply search filter
    result = filterBySearch(result, searchQuery);

    // Apply status filter
    result = filterByStatus(result, filterBy);

    // Apply sort
    result = sortSubjects(result, sortBy);

    return result;
  }, [subjects, searchQuery, filterBy, sortBy]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">
                Failed to load subjects
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!subjects || subjects.length === 0) {
    return (
      <>
        <div className="mx-auto max-w-7xl p-6">
          <EmptyState onCreateSubject={handleOpenCreate} />
        </div>

        {/* Create Modal */}
        {modalState.type === "create" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl">
              <SubjectForm
                mode="create"
                onSubmit={handleCreateSubject}
                onCancel={handleCloseModal}
                isLoading={createMutation.isPending}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Main content with subjects
  return (
    <>
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Subjects</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your study subjects and track your progress
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="size-5" />
            Add Subject
          </button>
        </div>

        {/* Toolbar */}
        <SubjectsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={subjects.length}
          filteredCount={filteredAndSortedSubjects.length}
        />

        {/* No Results */}
        {filteredAndSortedSubjects.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">
              No subjects found matching your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterBy("all");
              }}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => handleCardClick(subject.id)}
                onEdit={() => handleOpenEdit(subject)}
                onDelete={() => handleOpenDelete(subject)}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredAndSortedSubjects.map((subject) => (
              <SubjectListItem
                key={subject.id}
                subject={subject}
                onClick={() => handleCardClick(subject.id)}
                onEdit={() => handleOpenEdit(subject)}
                onDelete={() => handleOpenDelete(subject)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalState.type === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <SubjectForm
              mode="create"
              onSubmit={handleCreateSubject}
              onCancel={handleCloseModal}
              isLoading={createMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalState.type === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
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
