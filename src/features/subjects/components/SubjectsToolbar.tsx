import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import type { SortOption, FilterOption, ViewMode } from "../utils/filterSort";

interface SubjectsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
}

// =============================================
// Component
// =============================================

export default function SubjectsToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: SubjectsToolbarProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side - Sort & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="name">Name (A-Z)</option>
              <option value="test-date">Test Date</option>
              <option value="progress">Progress</option>
              <option value="last-studied">Last Studied</option>
            </select>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-1 rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => onFilterChange("all")}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                filterBy === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange("active")}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                filterBy === "active"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onFilterChange("past")}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                filterBy === "past"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Past
            </button>
          </div>

          {/* Results Count */}
          <span className="text-sm text-gray-600">
            {filteredCount === totalCount ? (
              <span>
                {totalCount} {totalCount === 1 ? "subject" : "subjects"}
              </span>
            ) : (
              <span>
                {filteredCount} of {totalCount}{" "}
                {totalCount === 1 ? "subject" : "subjects"}
              </span>
            )}
          </span>
        </div>

        {/* Right Side - View Toggle */}
        <div className="flex gap-1 rounded-lg border border-gray-300 bg-white p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`rounded p-1.5 transition-colors ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`rounded p-1.5 transition-colors ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="List view"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
