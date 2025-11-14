import React from "react";
import { ChevronRight } from "lucide-react";
import type { MaterialWithSubject } from "../../types/quiz";
import { getMaterialIcon } from "../../utils/quizUtils";
import { calculateTimeAgo } from "../../utils/quizUtils";

interface MaterialCardProps {
  material: MaterialWithSubject;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const Icon = getMaterialIcon(material.file_type);
  const timeAgo = calculateTimeAgo(material.created_at);

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">
          {material.file_name}
        </p>
        <p className="text-xs text-slate-600">{timeAgo}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    </div>
  );
};
