/**
 * Material Upload Page
 * Main page for uploading and managing study materials
 */

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Upload, Loader2, FileSearch, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MaterialCard,
  MaterialsToolbar,
  MaterialDetailModal,
  EmptyState,
  UploadModal,
  StorageStatsCard,
  MaterialStatsCard,
} from "../components";
import {
  useMaterials,
  useDeleteMaterial,
  useStorageUsage,
  materialsKeys,
} from "../hooks";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { getSignedUrl } from "../services/storageService";
import {
  MaterialType,
  MaterialSortOption,
  MaterialViewMode,
  ProcessingStatus,
  type StudyMaterial,
} from "../types/material.types";
import { cn } from "@/lib/utils";

export function MaterialUploadPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if we came from subject detail page (via query string)
  const fromSubjectId = searchParams.get("subjectId");
  const showBackButton = !!fromSubjectId;

  // Selected subject state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    fromSubjectId || null
  );

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter and view state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<MaterialSortOption>("date_desc");
  const [viewMode, setViewMode] = useState<MaterialViewMode>("grid");
  const [selectedTypes, setSelectedTypes] = useState<MaterialType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ProcessingStatus[]>(
    []
  );

  // Modal state
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hooks
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const { materials, getFilteredMaterials, isLoading, refetch } = useMaterials({
    subjectId: selectedSubjectId || undefined,
  });
  const { data: storageUsage, isLoading: loadingStorage } = useStorageUsage();
  const deleteMutation = useDeleteMaterial();

  // Update selected subject when URL changes
  useEffect(() => {
    if (fromSubjectId && fromSubjectId !== selectedSubjectId) {
      setSelectedSubjectId(fromSubjectId);
    }
    // Only run when fromSubjectId changes, not selectedSubjectId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromSubjectId]);

  // Get filtered materials
  const filteredMaterials = getFilteredMaterials({
    searchQuery,
    materialTypes: selectedTypes,
    processingStatuses: selectedStatuses,
    sortBy,
  });

  /**
   * Opens upload modal
   */
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  /**
   * Handles upload completion
   */
  const handleUploadComplete = () => {
    // Refetch materials
    refetch();
    // Invalidate storage usage to update the stats
    queryClient.invalidateQueries({ queryKey: materialsKeys.all });
  };

  /**
   * Views material details
   */
  const handleViewMaterial = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  /**
   * Downloads a material
   */
  const handleDownloadMaterial = async (material: StudyMaterial) => {
    try {
      const url = await getSignedUrl(material.storage_path, 60);
      if (url) {
        // Open download in new tab
        window.open(url, "_blank");
        toast.success("Download started", {
          description: material.file_name,
        });
      } else {
        toast.error("Download failed", {
          description: "Could not generate download link",
        });
      }
    } catch (error) {
      toast.error("Download failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  /**
   * Deletes a material
   */
  const handleDeleteMaterial = async (material: StudyMaterial) => {
    try {
      await deleteMutation.mutateAsync({
        materialId: material.id,
        storagePath: material.storage_path,
      });
      toast.success("Material deleted 🗑️", {
        description: material.file_name,
      });
      // Note: deleteMutation already invalidates queries, but we refetch to be sure
      refetch();
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section with Gradient Background */}
      <div className="border-b border-slate-200/60 bg-linear-to-br from-slate-50 to-indigo-50/30 px-4 py-4 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-7xl">
          {/* Back Button - only show if came from subject detail */}
          {showBackButton && (
            <button
              onClick={() => navigate(`/subjects/${fromSubjectId}`)}
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 transition-all hover:text-slate-900 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subject
            </button>
          )}

          {/* Header with Upload Button */}
          <div className="mb-4 flex items-start justify-between lg:mb-6">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-slate-900 lg:mb-2 lg:text-4xl">
                Study Materials
              </h1>
              <p className="text-sm text-slate-600 lg:text-base">
                Upload and manage your learning resources
              </p>
            </div>

            {/* Upload Button - Desktop Only */}
            <button
              onClick={handleOpenUploadModal}
              className="hidden items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95 lg:flex"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Materials</span>
            </button>
          </div>

          {/* Subject Filter - Desktop Dropdown / Mobile Scroll */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row">
            {/* Desktop Subject Selector */}
            <div className="hidden lg:block">
              <Select
                value={selectedSubjectId || "all"}
                onValueChange={(value) =>
                  setSelectedSubjectId(value === "all" ? null : value)
                }
                disabled={loadingSubjects}
              >
                <SelectTrigger className="h-12 w-[200px] rounded-xl border-2 border-slate-200 bg-white font-semibold transition-all hover:border-slate-300">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Subject Horizontal Scroll */}
            <div className="-mx-4 overflow-x-auto px-4 lg:hidden">
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setSelectedSubjectId(null)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95",
                    !selectedSubjectId
                      ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-md"
                      : "border-2 border-slate-200 bg-white text-slate-700"
                  )}
                >
                  All Subjects
                </button>
                {subjects?.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95",
                      selectedSubjectId === subject.id
                        ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "border-2 border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex-1">
              <MaterialsToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedTypes={selectedTypes}
                onTypesChange={setSelectedTypes}
                selectedStatuses={selectedStatuses}
                onStatusesChange={setSelectedStatuses}
                totalCount={filteredMaterials.length}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <MaterialStatsCard materials={materials} isLoading={isLoading} />
            <StorageStatsCard
              used={storageUsage?.used || 0}
              limit={storageUsage?.limit || 524288000}
              isLoading={loadingStorage}
            />
            {/* Processing/Pending Count */}
            <div className="hidden rounded-xl border-2 border-slate-200 bg-white p-3 lg:block lg:p-4">
              <p className="mb-1 text-xs font-medium text-slate-600 lg:text-sm">
                Status
              </p>
              <p className="text-xl font-bold text-slate-900 lg:text-3xl">
                Ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && materials.length === 0 && (
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-12 text-center">
              <EmptyState
                icon={Upload}
                title="No materials yet"
                description="Upload your first study material to get started"
              />
            </div>
          )}

          {/* No results state */}
          {!isLoading &&
            materials.length > 0 &&
            filteredMaterials.length === 0 && (
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-12 text-center">
                <EmptyState
                  icon={FileSearch}
                  title="No results found"
                  description="No materials match your current filters"
                />
              </div>
            )}

          {/* Materials grid/list */}
          {!isLoading && filteredMaterials.length > 0 && (
            <div
              className={cn(
                viewMode === "grid" &&
                  "grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3",
                viewMode === "list" && "space-y-3"
              )}
            >
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleViewMaterial}
                  onDownload={handleDownloadMaterial}
                  onDelete={handleDeleteMaterial}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB - Fixed Bottom Right */}
      <button
        onClick={handleOpenUploadModal}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl transition-all hover:shadow-2xl active:scale-95 lg:hidden"
      >
        <Upload className="h-6 w-6" />
      </button>

      {/* Upload Modal */}
      <UploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        preSelectedSubjectId={selectedSubjectId}
        onUploadComplete={handleUploadComplete}
      />

      {/* Material Detail Modal */}
      <MaterialDetailModal
        material={selectedMaterial}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onDownload={handleDownloadMaterial}
      />
    </div>
  );
}
