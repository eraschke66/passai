import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Video,
  AlignLeft,
  Book,
  FileCheck,
} from "lucide-react";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "text-green-600 bg-green-50 border-green-200";
    case "medium":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "hard":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-emerald-600 bg-emerald-50";
    case "in-progress":
      return "text-blue-600 bg-blue-50";
    case "not-started":
      return "text-slate-600 bg-slate-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "in-progress":
      return Clock;
    case "not-started":
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

// Previous functions...

export const getMaterialIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return FileText;
    case "video":
      return Video;
    case "notes":
      return AlignLeft;
    case "textbook":
      return Book;
    case "slides":
      return FileCheck;
    default:
      return FileText;
  }
};

export const getMaterialColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "from-red-500 to-pink-600";
    case "video":
      return "from-purple-500 to-indigo-600";
    case "notes":
      return "from-blue-500 to-cyan-600";
    case "textbook":
      return "from-green-500 to-emerald-600";
    case "slides":
      return "from-amber-500 to-orange-600";
    default:
      return "from-slate-500 to-slate-600";
  }
};

export function calculateTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 0) return "just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return count === 1
        ? `${count} ${interval.label} ago`
        : `${count} ${interval.label}s ago`;
    }
  }

  return "just now";
}
