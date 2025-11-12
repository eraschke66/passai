/**
 * Materials Toolbar Component
 * Provides filtering, sorting, and view controls for materials
 */

import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MaterialType,
  MaterialSortOption,
  MaterialViewMode,
  ProcessingStatus,
} from "../types/material.types";

export interface MaterialsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: MaterialSortOption;
  onSortChange: (sort: MaterialSortOption) => void;
  viewMode: MaterialViewMode;
  onViewModeChange: (mode: MaterialViewMode) => void;
  selectedTypes: MaterialType[];
  onTypesChange: (types: MaterialType[]) => void;
  selectedStatuses: ProcessingStatus[];
  onStatusesChange: (statuses: ProcessingStatus[]) => void;
  totalCount?: number;
  className?: string;
}

const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  pdf: "PDF",
  image: "Image",
  docx: "Word",
  pptx: "PowerPoint",
  text: "Text",
};

const PROCESSING_STATUS_LABELS: Record<ProcessingStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

const SORT_OPTIONS: { value: MaterialSortOption; label: string }[] = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "size_desc", label: "Largest First" },
  { value: "size_asc", label: "Smallest First" },
];

export function MaterialsToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedTypes,
  onTypesChange,
  selectedStatuses,
  onStatusesChange,
  className,
}: MaterialsToolbarProps) {
  const hasActiveFilters =
    selectedTypes.length > 0 || selectedStatuses.length > 0;

  const toggleType = (type: MaterialType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const toggleStatus = (status: ProcessingStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const clearFilters = () => {
    onTypesChange([]);
    onStatusesChange([]);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Filters - Hidden on mobile, will use dropdown on desktop */}
      <div className="hidden gap-2 lg:flex">
        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as MaterialSortOption)}
        >
          <SelectTrigger className="w-40 rounded-xl border-2 border-slate-200 bg-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="relative rounded-xl border-2 border-slate-200 bg-white font-semibold hover:border-slate-300"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {selectedTypes.length + selectedStatuses.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>File Types</DropdownMenuLabel>
            {(Object.keys(MATERIAL_TYPE_LABELS) as MaterialType[]).map(
              (type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                >
                  {MATERIAL_TYPE_LABELS[type]}
                </DropdownMenuCheckboxItem>
              )
            )}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {(Object.keys(PROCESSING_STATUS_LABELS) as ProcessingStatus[]).map(
              (status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                >
                  {PROCESSING_STATUS_LABELS[status]}
                </DropdownMenuCheckboxItem>
              )
            )}

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full justify-start"
                >
                  Clear Filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View mode toggle */}
        <div className="flex rounded-lg border-2 border-slate-200 bg-white">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-full rounded-l-lg rounded-r-none border-0"
          >
            <Grid3x3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-full rounded-l-none rounded-r-lg border-l-2 border-slate-200"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
