import React from "react";
import { Sprout, Leaf, ArrowRight } from "lucide-react";

interface GardenTeaserProps {
  pointsEarned: number;
  newProgress: number;
  onViewGarden: () => void;
  subject: string;
}

export const GardenTeaser: React.FC<GardenTeaserProps> = ({
  pointsEarned,
  newProgress,
  onViewGarden,
  subject,
}) => {
  return (
    <div className="bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl border-2 border-emerald-400 p-6 lg:p-8 text-white shadow-xl">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Your Garden Grew! 🌱</h2>
          <p className="text-white/90 text-sm lg:text-base">
            You earned{" "}
            <span className="font-bold text-white">{pointsEarned} points</span>{" "}
            for your {subject} garden!
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white/90">
            Level Progress
          </span>
          <span className="text-sm font-bold text-white">
            {Math.round(newProgress)}%
          </span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${newProgress}%` }}
          />
        </div>
      </div>
      <button
        onClick={onViewGarden}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all"
      >
        <Leaf className="w-5 h-5" />
        <span>View Your Garden</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
