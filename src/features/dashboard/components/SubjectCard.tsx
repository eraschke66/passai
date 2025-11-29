import type {
  Subject,
  SubjectColor,
} from "@/features/subjects/types/subject.types";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  BookOpen,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
}

// Status configuration for different pass chance levels
type StatusConfig = {
  icon: React.ElementType;
  label: string;
  colorClass: string;
};

function getSubjectStatus(subject: Subject): StatusConfig {
  const passChance = subject.pass_chance ?? 0;
  const testDate = subject.test_date ? new Date(subject.test_date) : null;
  const lastStudied = subject.last_studied_at
    ? new Date(subject.last_studied_at)
    : null;
  const now = new Date();

  // Calculate days until test
  const daysUntilTest = testDate
    ? Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate days since last studied
  const daysSinceStudied = lastStudied
    ? Math.floor(
        (now.getTime() - lastStudied.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Critical: Test is very soon and pass chance is low
  if (daysUntilTest !== null && daysUntilTest <= 3 && passChance < 60) {
    return {
      icon: AlertTriangle,
      label: "Needs Attention",
      colorClass: "text-red-600 dark:text-red-400",
    };
  }

  // Warning: Haven't studied in a while
  if (daysSinceStudied !== null && daysSinceStudied > 7) {
    return {
      icon: Clock,
      label: "Review Needed",
      colorClass: "text-amber-600 dark:text-amber-400",
    };
  }

  // Status based on pass chance
  if (passChance >= 80) {
    return {
      icon: TrendingUp,
      label: "Excellent",
      colorClass: "text-green-600 dark:text-green-400",
    };
  }

  if (passChance >= 60) {
    return {
      icon: TrendingUp,
      label: "On Track",
      colorClass: "text-green-600 dark:text-green-400",
    };
  }

  if (passChance >= 40) {
    return {
      icon: Minus,
      label: "Keep Going",
      colorClass: "text-amber-600 dark:text-amber-400",
    };
  }

  if (passChance > 0) {
    return {
      icon: TrendingDown,
      label: "Needs Work",
      colorClass: "text-orange-600 dark:text-orange-400",
    };
  }

  // No data yet
  return {
    icon: BookOpen,
    label: "Get Started",
    colorClass: "text-slate-500 dark:text-slate-400",
  };
}

const COLOR_VARIANTS: Record<
  SubjectColor,
  { bg: string; text: string; gradient: string; stopColor: string }
> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-600 to-blue-400",
    stopColor: "#2563eb",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    gradient: "from-green-600 to-green-400",
    stopColor: "#16a34a",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-600 to-purple-400",
    stopColor: "#9333ea",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    gradient: "from-red-600 to-red-400",
    stopColor: "#dc2626",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-600 to-amber-400",
    stopColor: "#d97706",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-400",
    gradient: "from-pink-600 to-pink-400",
    stopColor: "#db2777",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-600 dark:text-cyan-400",
    gradient: "from-cyan-600 to-cyan-400",
    stopColor: "#0891b2",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600 to-indigo-400",
    stopColor: "#4f46e5",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-600 to-emerald-400",
    stopColor: "#059669",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-600 to-rose-400",
    stopColor: "#e11d48",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-600 to-violet-400",
    stopColor: "#7c3aed",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-400",
    gradient: "from-teal-600 to-teal-400",
    stopColor: "#0d9488",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-600 to-orange-400",
    stopColor: "#ea580c",
  },
  lime: {
    bg: "bg-lime-100 dark:bg-lime-900/30",
    text: "text-lime-600 dark:text-lime-400",
    gradient: "from-lime-600 to-lime-400",
    stopColor: "#65a30d",
  },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    gradient: "from-fuchsia-600 to-fuchsia-400",
    stopColor: "#c026d3",
  },
};

export const SubjectCard = ({ subject }: SubjectCardProps) => {
  const passChance = subject.pass_chance || 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (passChance / 100) * circumference;

  // Get color styles or fallback to blue
  const colorStyles = COLOR_VARIANTS[subject.color] || COLOR_VARIANTS.blue;

  // Get dynamic status based on performance
  const status = getSubjectStatus(subject);
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 border-2 border-transparent hover:border-primary/20 group relative overflow-hidden">
      <div className="flex items-start justify-between mb-4 relative z-10 gap-3">
        <div className="flex-1 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate cursor-default">
                  {subject.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{subject.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {subject.exam_board || "General"}
          </p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
            colorStyles.bg
          )}
        >
          <BookOpen className={cn("w-5 h-5", colorStyles.text)} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 140 140"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Progress Circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={`url(#gradient-${subject.id})`}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient
                id={`gradient-${subject.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={colorStyles.stopColor}
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor={colorStyles.stopColor}
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r",
                colorStyles.gradient
              )}
            >
              {passChance}%
            </span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">
              Pass Chance
            </span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm relative z-10">
        <div className={cn("flex items-center gap-1.5", status.colorClass)}>
          <StatusIcon className="w-4 h-4" />
          <span className="font-medium">{status.label}</span>
        </div>
        {subject.test_date && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(subject.test_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div
        className={cn(
          "absolute -bottom-20 -right-20 w-40 h-40 bg-linear-to-br rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500",
          colorStyles.gradient
        )}
      />
    </Card>
  );
};
