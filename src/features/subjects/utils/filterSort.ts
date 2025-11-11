import type { Subject } from "../types/subject.types";

export type SortOption = "name" | "test-date" | "progress" | "last-studied";
export type FilterOption = "all" | "active" | "past";
export type ViewMode = "grid" | "list";

/**
 * Filter subjects based on search query
 */
export function filterBySearch(subjects: Subject[], query: string): Subject[] {
  if (!query.trim()) return subjects;

  const lowerQuery = query.toLowerCase();
  return subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(lowerQuery) ||
      subject.description?.toLowerCase().includes(lowerQuery) ||
      subject.exam_board?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter subjects based on filter option
 */
export function filterByStatus(
  subjects: Subject[],
  filter: FilterOption
): Subject[] {
  if (filter === "all") return subjects;

  const now = new Date();
  return subjects.filter((subject) => {
    if (!subject.test_date) return filter === "active"; // No test date = active

    const testDate = new Date(subject.test_date);
    const isPast = testDate < now;

    return filter === "past" ? isPast : !isPast;
  });
}

/**
 * Sort subjects based on sort option
 */
export function sortSubjects(
  subjects: Subject[],
  sortBy: SortOption
): Subject[] {
  const sorted = [...subjects];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "test-date":
      return sorted.sort((a, b) => {
        // No date goes to bottom
        if (!a.test_date && !b.test_date) return 0;
        if (!a.test_date) return 1;
        if (!b.test_date) return -1;
        return (
          new Date(a.test_date).getTime() - new Date(b.test_date).getTime()
        );
      });

    case "progress":
      return sorted.sort((a, b) => b.progress - a.progress); // Descending

    case "last-studied":
      return sorted.sort((a, b) => {
        // No last_studied goes to bottom
        if (!a.last_studied_at && !b.last_studied_at) return 0;
        if (!a.last_studied_at) return 1;
        if (!b.last_studied_at) return -1;
        return (
          new Date(b.last_studied_at).getTime() -
          new Date(a.last_studied_at).getTime()
        ); // Most recent first
      });

    default:
      return sorted;
  }
}
