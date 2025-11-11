import {
  Calendar,
  Edit,
  Trash2,
  TrendingUp,
  BookOpen,
  Target,
} from "lucide-react";
import type { Subject } from "@/features/subjects/types";
import {
  calculateDaysUntilTest,
  isTestSoon,
  getProgressLevel,
  getPassChanceLevel,
} from "@/features/subjects/utils";

// =============================================
// Types
// =============================================

interface SubjectCardProps {
  subject: Subject;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onClick?: (subject: Subject) => void;
}

// =============================================
// Helper Functions
// =============================================

function getIconComponent(icon: string) {
  // Map icon names to Lucide components
  const iconMap: Record<string, typeof BookOpen> = {
    book: BookOpen,
    // For now, we'll use BookOpen as fallback
    // We'll create a proper icon mapper in the future
  };

  return iconMap[icon] || BookOpen;
}

function getColorClasses(color: string) {
  // Map color names to Tailwind classes
  const colorMap: Record<
    string,
    { bg: string; border: string; text: string; badge: string }
  > = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-600",
      badge: "bg-pink-100 text-pink-700",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      badge: "bg-cyan-100 text-cyan-700",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      badge: "bg-rose-100 text-rose-700",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-600",
      badge: "bg-violet-100 text-violet-700",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      badge: "bg-teal-100 text-teal-700",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
    },
    lime: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-600",
      badge: "bg-lime-100 text-lime-700",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      text: "text-fuchsia-600",
      badge: "bg-fuchsia-100 text-fuchsia-700",
    },
  };

  return colorMap[color] || colorMap.blue;
}

function formatTestDate(testDate: string | null): {
  text: string;
  urgency: "none" | "normal" | "soon" | "past";
} {
  if (!testDate) {
    return { text: "No test date set", urgency: "none" };
  }

  const days = calculateDaysUntilTest(testDate);

  if (days === null) {
    return { text: "No test date", urgency: "none" };
  }

  if (days < 0) {
    return { text: "Test completed", urgency: "past" };
  }

  if (days === 0) {
    return { text: "Test today!", urgency: "soon" };
  }

  if (days === 1) {
    return { text: "Test tomorrow!", urgency: "soon" };
  }

  if (isTestSoon(testDate)) {
    return { text: `${days} days left`, urgency: "soon" };
  }

  return { text: `${days} days left`, urgency: "normal" };
}

// =============================================
// Component
// =============================================

export function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onClick,
}: SubjectCardProps) {
  const Icon = getIconComponent(subject.icon);
  const colors = getColorClasses(subject.color);
  const testDateInfo = formatTestDate(subject.test_date);
  const progressLevel = getProgressLevel(subject.progress);
  const passChanceLevel = getPassChanceLevel(subject.pass_chance);

  const handleCardClick = () => {
    if (onClick) {
      onClick(subject);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(subject);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(subject);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border-2 ${
        colors.border
      } hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${
        testDateInfo.urgency === "soon"
          ? "ring-2 ring-red-500 ring-offset-2"
          : ""
      }`}
    >
      {/* Colored accent bar */}
      <div className={`h-2 ${colors.bg}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div
              className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Name and Description */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {subject.name}
              </h3>
              {subject.description && (
                <p className="text-sm text-slate-600 line-clamp-1">
                  {subject.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Edit subject"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                aria-label="Delete subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Progress
              </span>
              <span
                className={`font-bold ${
                  progressLevel === "high"
                    ? "text-green-600"
                    : progressLevel === "medium"
                    ? "text-amber-600"
                    : "text-slate-600"
                }`}
              >
                {subject.progress}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  progressLevel === "high"
                    ? "bg-green-500"
                    : progressLevel === "medium"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>

          {/* Pass Chance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Target className="w-3 h-3" />
                Pass Chance
              </span>
              {subject.pass_chance !== null ? (
                <span
                  className={`font-bold ${
                    passChanceLevel === "high"
                      ? "text-green-600"
                      : passChanceLevel === "medium"
                      ? "text-amber-600"
                      : passChanceLevel === "low"
                      ? "text-red-600"
                      : "text-slate-600"
                  }`}
                >
                  {subject.pass_chance}%
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  Need data
                </span>
              )}
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              {subject.pass_chance !== null ? (
                <div
                  className={`h-full transition-all duration-500 ${
                    passChanceLevel === "high"
                      ? "bg-green-500"
                      : passChanceLevel === "medium"
                      ? "bg-amber-500"
                      : passChanceLevel === "low"
                      ? "bg-red-500"
                      : "bg-slate-400"
                  }`}
                  style={{ width: `${subject.pass_chance}%` }}
                />
              ) : (
                <div className="h-full bg-slate-300 w-full opacity-30" />
              )}
            </div>
          </div>
        </div>

        {/* Test Date */}
        {subject.test_date && (
          <div
            className={`flex items-center gap-2 text-sm ${
              testDateInfo.urgency === "soon"
                ? "text-red-600 font-bold"
                : testDateInfo.urgency === "past"
                ? "text-slate-400"
                : "text-slate-600"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{testDateInfo.text}</span>
          </div>
        )}

        {/* Exam Board Badge */}
        {subject.exam_board && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}
            >
              {subject.exam_board}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
