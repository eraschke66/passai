import React from "react";
import { Star } from "lucide-react";

interface PointsCelebrationProps {
  showAnimation: boolean;
  pointsEarned: number;
}

export const PointsCelebration: React.FC<PointsCelebrationProps> = ({
  showAnimation,
  pointsEarned,
}) => {
  if (!showAnimation) return null;

  return (
    <div className="text-center animate-in zoom-in-95 duration-500">
      <div className="inline-flex items-center gap-3 px-6 py-4 bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-lg mb-4">
        <Star className="w-8 h-8 animate-pulse" />
        <div className="text-left">
          <p className="text-sm font-semibold text-white/90">Points Earned</p>
          <p className="text-3xl font-bold">+{pointsEarned}</p>
        </div>
      </div>
    </div>
  );
};
