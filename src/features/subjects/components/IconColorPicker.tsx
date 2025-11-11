import { Check } from "lucide-react";
import { SUBJECT_PRESETS } from "@/features/subjects/types";
import type { SubjectIcon, SubjectColor } from "@/features/subjects/types";

// =============================================
// Types
// =============================================

interface IconColorPickerProps {
  selectedIcon: SubjectIcon;
  selectedColor: SubjectColor;
  onChange: (icon: SubjectIcon, color: SubjectColor) => void;
}

// =============================================
// Helper Function
// =============================================

function getColorClasses(color: string): {
  bg: string;
  border: string;
  selected: string;
} {
  const colorMap: Record<
    string,
    { bg: string; border: string; selected: string }
  > = {
    blue: {
      bg: "bg-blue-100",
      border: "border-blue-500",
      selected: "bg-blue-500",
    },
    green: {
      bg: "bg-green-100",
      border: "border-green-500",
      selected: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-100",
      border: "border-purple-500",
      selected: "bg-purple-500",
    },
    red: { bg: "bg-red-100", border: "border-red-500", selected: "bg-red-500" },
    amber: {
      bg: "bg-amber-100",
      border: "border-amber-500",
      selected: "bg-amber-500",
    },
    pink: {
      bg: "bg-pink-100",
      border: "border-pink-500",
      selected: "bg-pink-500",
    },
    cyan: {
      bg: "bg-cyan-100",
      border: "border-cyan-500",
      selected: "bg-cyan-500",
    },
    indigo: {
      bg: "bg-indigo-100",
      border: "border-indigo-500",
      selected: "bg-indigo-500",
    },
    emerald: {
      bg: "bg-emerald-100",
      border: "border-emerald-500",
      selected: "bg-emerald-500",
    },
    rose: {
      bg: "bg-rose-100",
      border: "border-rose-500",
      selected: "bg-rose-500",
    },
    violet: {
      bg: "bg-violet-100",
      border: "border-violet-500",
      selected: "bg-violet-500",
    },
    teal: {
      bg: "bg-teal-100",
      border: "border-teal-500",
      selected: "bg-teal-500",
    },
    orange: {
      bg: "bg-orange-100",
      border: "border-orange-500",
      selected: "bg-orange-500",
    },
    lime: {
      bg: "bg-lime-100",
      border: "border-lime-500",
      selected: "bg-lime-500",
    },
    fuchsia: {
      bg: "bg-fuchsia-100",
      border: "border-fuchsia-500",
      selected: "bg-fuchsia-500",
    },
  };

  return colorMap[color] || colorMap.blue;
}

// =============================================
// Component
// =============================================

export function IconColorPicker({
  selectedIcon,
  selectedColor,
  onChange,
}: IconColorPickerProps) {
  const handlePresetClick = (icon: SubjectIcon, color: SubjectColor) => {
    onChange(icon, color);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Icon & Color
      </label>

      <div className="grid grid-cols-5 gap-3">
        {SUBJECT_PRESETS.map((preset) => {
          const colors = getColorClasses(preset.color);
          const isSelected =
            selectedIcon === preset.icon && selectedColor === preset.color;

          return (
            <button
              key={`${preset.icon}-${preset.color}`}
              type="button"
              onClick={() =>
                handlePresetClick(
                  preset.icon as SubjectIcon,
                  preset.color as SubjectColor
                )
              }
              className={`relative aspect-square rounded-xl ${
                colors.bg
              } border-2 ${
                isSelected ? colors.border : "border-transparent"
              } hover:scale-105 transition-all flex items-center justify-center group`}
              title={preset.name}
            >
              {/* Icon placeholder - we'll use emoji for now */}
              <span className="text-2xl">📚</span>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${colors.selected} flex items-center justify-center`}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Tooltip on hover */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
                  {preset.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Select an icon and color combination for your subject
      </p>
    </div>
  );
}
