import React from "react";
import { X, Sparkles } from "lucide-react";

interface GardenHeaderProps {
  subjectColor: string;
  subject: string;
  onClose: () => void;
}

export const GardenHeader: React.FC<GardenHeaderProps> = ({
  subjectColor,
  subject,
  onClose,
}) => {
  return (
    <div
      className={`px-6 lg:px-8 py-8 bg-linear-to-br ${subjectColor} text-white relative overflow-hidden`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">Garden Growth</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold mb-2">
          {subject} Garden
        </h2>
        <p className="text-white/90 text-base">
          Watch your knowledge bloom! 🌸
        </p>
      </div>
    </div>
  );
};
