/**
 * Filter and Sort Utilities
 * Functions for filtering and sorting materials
 */

import type {
  StudyMaterial,
  MaterialType,
  MaterialSortOption,
  ProcessingStatus,
} from "../types/material.types";

export interface FilterOptions {
  searchQuery?: string;
  materialTypes?: MaterialType[];
  processingStatuses?: ProcessingStatus[];
  sortBy?: MaterialSortOption;
}

/**
 * Filters materials by search query (searches file name and text content)
 */
function filterBySearch(
  materials: StudyMaterial[],
  query: string
): StudyMaterial[] {
  if (!query.trim()) return materials;

  const lowerQuery = query.toLowerCase();
  return materials.filter((material) => {
    const fileName = material.file_name.toLowerCase();
    const textContent = material.text_content?.toLowerCase() || "";
    return fileName.includes(lowerQuery) || textContent.includes(lowerQuery);
  });
}

/**
 * Filters materials by type
 */
function filterByType(
  materials: StudyMaterial[],
  types: MaterialType[]
): StudyMaterial[] {
  if (!types || types.length === 0) return materials;

  return materials.filter((material) => types.includes(material.file_type));
}

/**
 * Filters materials by processing status
 */
function filterByStatus(
  materials: StudyMaterial[],
  statuses: ProcessingStatus[]
): StudyMaterial[] {
  if (!statuses || statuses.length === 0) return materials;

  return materials.filter((material) =>
    statuses.includes(material.processing_status)
  );
}

/**
 * Sorts materials by specified option
 */
function sortMaterials(
  materials: StudyMaterial[],
  sortBy?: MaterialSortOption
): StudyMaterial[] {
  const sorted = [...materials];

  switch (sortBy) {
    case "name_asc":
      return sorted.sort((a, b) => a.file_name.localeCompare(b.file_name));

    case "name_desc":
      return sorted.sort((a, b) => b.file_name.localeCompare(a.file_name));

    case "date_asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    case "date_desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    case "size_asc":
      return sorted.sort((a, b) => a.file_size - b.file_size);

    case "size_desc":
      return sorted.sort((a, b) => b.file_size - a.file_size);

    default:
      // Default to date_desc
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

/**
 * Applies all filters and sorting to materials
 */
export function filterAndSortMaterials(
  materials: StudyMaterial[],
  options: FilterOptions = {}
): StudyMaterial[] {
  let filtered = materials;

  // Apply search filter
  if (options.searchQuery) {
    filtered = filterBySearch(filtered, options.searchQuery);
  }

  // Apply type filter
  if (options.materialTypes && options.materialTypes.length > 0) {
    filtered = filterByType(filtered, options.materialTypes);
  }

  // Apply status filter
  if (options.processingStatuses && options.processingStatuses.length > 0) {
    filtered = filterByStatus(filtered, options.processingStatuses);
  }

  // Apply sorting
  filtered = sortMaterials(filtered, options.sortBy);

  return filtered;
}
