import {
  BookOpen,
  Microscope,
  Beaker,
  Calculator,
  Globe,
  Brain,
  Atom,
  Languages,
  Palette,
  Music,
  Laptop,
  ScrollText,
  Trophy,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import type { SubjectIcon, SubjectColor } from "../types/subject.types";

// =============================================
// Icon Mapping
// =============================================

const ICON_MAP: Record<SubjectIcon, LucideIcon> = {
  book: BookOpen,
  microscope: Microscope,
  flask: Beaker,
  calculator: Calculator,
  globe: Globe,
  brain: Brain,
  atom: Atom,
  dna: Brain,
  language: Languages,
  palette: Palette,
  music: Music,
  laptop: Laptop,
  scroll: ScrollText,
  trophy: Trophy,
  rocket: Rocket,
};

/**
 * Get the Lucide icon component for a subject icon name
 */
export function getSubjectIcon(icon: SubjectIcon): LucideIcon {
  return ICON_MAP[icon] || BookOpen;
}

// =============================================
// Color Mapping
// =============================================

interface ColorClasses {
  bg: string;
  bgGradient: string;
  border: string;
  text: string;
  badge: string;
  progressBar: string;
}

const COLOR_MAP: Record<SubjectColor, ColorClasses> = {
  blue: {
    bg: "bg-blue-50",
    bgGradient: "bg-linear-to-r from-blue-50 via-blue-100 to-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    progressBar: "bg-blue-600",
  },
  green: {
    bg: "bg-green-50",
    bgGradient: "bg-linear-to-r from-green-50 via-green-100 to-green-50",
    border: "border-green-200",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    progressBar: "bg-green-600",
  },
  purple: {
    bg: "bg-purple-50",
    bgGradient: "bg-linear-to-r from-purple-50 via-purple-100 to-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    progressBar: "bg-purple-600",
  },
  red: {
    bg: "bg-red-50",
    bgGradient: "bg-linear-to-r from-red-50 via-red-100 to-red-50",
    border: "border-red-200",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700",
    progressBar: "bg-red-600",
  },
  amber: {
    bg: "bg-amber-50",
    bgGradient: "bg-linear-to-r from-amber-50 via-amber-100 to-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    progressBar: "bg-amber-600",
  },
  pink: {
    bg: "bg-pink-50",
    bgGradient: "bg-linear-to-r from-pink-50 via-pink-100 to-pink-50",
    border: "border-pink-200",
    text: "text-pink-600",
    badge: "bg-pink-100 text-pink-700",
    progressBar: "bg-pink-600",
  },
  cyan: {
    bg: "bg-cyan-50",
    bgGradient: "bg-linear-to-r from-cyan-50 via-cyan-100 to-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    progressBar: "bg-cyan-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    bgGradient: "bg-linear-to-r from-indigo-50 via-indigo-100 to-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    progressBar: "bg-indigo-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    bgGradient: "bg-linear-to-r from-emerald-50 via-emerald-100 to-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    progressBar: "bg-emerald-600",
  },
  rose: {
    bg: "bg-rose-50",
    bgGradient: "bg-linear-to-r from-rose-50 via-rose-100 to-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    progressBar: "bg-rose-600",
  },
  violet: {
    bg: "bg-violet-50",
    bgGradient: "bg-linear-to-r from-violet-50 via-violet-100 to-violet-50",
    border: "border-violet-200",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    progressBar: "bg-violet-600",
  },
  teal: {
    bg: "bg-teal-50",
    bgGradient: "bg-linear-to-r from-teal-50 via-teal-100 to-teal-50",
    border: "border-teal-200",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    progressBar: "bg-teal-600",
  },
  orange: {
    bg: "bg-orange-50",
    bgGradient: "bg-linear-to-r from-orange-50 via-orange-100 to-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    progressBar: "bg-orange-600",
  },
  lime: {
    bg: "bg-lime-50",
    bgGradient: "bg-linear-to-r from-lime-50 via-lime-100 to-lime-50",
    border: "border-lime-200",
    text: "text-lime-600",
    badge: "bg-lime-100 text-lime-700",
    progressBar: "bg-lime-600",
  },
  fuchsia: {
    bg: "bg-fuchsia-50",
    bgGradient: "bg-linear-to-r from-fuchsia-50 via-fuchsia-100 to-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-600",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    progressBar: "bg-fuchsia-600",
  },
};

/**
 * Get the Tailwind color classes for a subject color
 */
export function getSubjectColorClasses(color: SubjectColor): ColorClasses {
  return COLOR_MAP[color] || COLOR_MAP.blue;
}
