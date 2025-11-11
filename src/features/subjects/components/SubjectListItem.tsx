import { Calendar, Edit, Trash2, TrendingUp, Target } from "lucide-react";
import type { Subject } from "../types/subject.types";
import {
  calculateDaysUntilTest,
  isTestSoon,
  getSubjectIcon,
  getSubjectColorClasses,
} from "../utils";

// =============================================
// Types
// =============================================

interface SubjectListItemProps {
  subject: Subject;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onClick?: (subject: Subject) => void;
}

// =============================================
// Component
// =============================================

export function SubjectListItem({
  subject,
  onEdit,
  onDelete,
  onClick,
}: SubjectListItemProps) {
  const IconComponent = getSubjectIcon(subject.icon);
  const colorClasses = getSubjectColorClasses(subject.color);

  const daysUntil = subject.test_date
    ? calculateDaysUntilTest(subject.test_date)
    : null;
  const testIsSoon = subject.test_date ? isTestSoon(subject.test_date) : false;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(subject);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(subject);
  };

  const handleClick = () => {
    onClick?.(subject);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Icon */}
      <div
        className={`flex shrink-0 size-14 items-center justify-center rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}
      >
        <IconComponent className={`size-7 ${colorClasses.text}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {subject.name}
          </h3>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Edit subject"
              >
                <Edit className="size-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Delete subject"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        </div>

        {subject.description && (
          <p className="mb-2 line-clamp-1 text-sm text-gray-600">
            {subject.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Progress */}
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4 text-gray-500" />
            <span className="font-medium text-gray-700">
              {subject.progress}%
            </span>
          </div>

          {/* Pass Chance */}
          <div className="flex items-center gap-1.5">
            <Target className="size-4 text-gray-500" />
            <span className="font-medium text-gray-700">
              {subject.pass_chance}%
            </span>
          </div>

          {/* Test Date */}
          {subject.test_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-gray-500" />
              <span
                className={
                  testIsSoon ? "font-medium text-red-600" : "text-gray-600"
                }
              >
                {daysUntil !== null && daysUntil >= 0
                  ? `${daysUntil}d`
                  : "Passed"}
              </span>
            </div>
          )}

          {/* Exam Board */}
          {subject.exam_board && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClasses.badge}`}
            >
              {subject.exam_board}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
