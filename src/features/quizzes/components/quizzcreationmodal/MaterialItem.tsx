import React from "react";
import { Check } from "lucide-react";
import type { Material } from "../../types/quiz";
import { getMaterialIcon, getMaterialColor } from "../../utils/quizUtils";
import { calculateTimeAgo } from "../../utils/quizUtils";

interface MaterialItemProps {
  material: Material;
  isSelected: boolean;
  onToggle: () => void;
}

export const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  isSelected,
  onToggle,
}) => {
  const Icon = getMaterialIcon(material.file_type);

  const timeAgo = calculateTimeAgo(material.created_at);

  return (
    <button
      onClick={onToggle}
      className={`w-full p-3 lg:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-linear-to-br ${getMaterialColor(
            material.file_type
          )} flex items-center justify-center shrink-0`}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-bold text-slate-900 text-sm lg:text-base truncate">
            {material.file_name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {/* {material.page_count && (             // TODo: add page count to materials
              <>
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span className="text-xs text-slate-600">
                  {material.page_count} pages
                </span>
              </>
            )} */}
            {/* Use date of upload of material to calculate how long ago it was uploaded */}
            {timeAgo && (
              <>
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span className="text-xs text-slate-600">{timeAgo}</span>
              </>
            )}
          </div>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
            isSelected
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-slate-300"
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </button>
  );
};
