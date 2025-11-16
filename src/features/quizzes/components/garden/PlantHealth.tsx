import React from "react";
import { Heart } from "lucide-react";

interface PlantHealthProps {
  plantHealth: number;
}

export const PlantHealth: React.FC<PlantHealthProps> = ({ plantHealth }) => {
  const getHealthColor = () => {
    if (plantHealth >= 80) return "from-emerald-500 to-green-600";
    if (plantHealth >= 60) return "from-green-500 to-emerald-600";
    if (plantHealth >= 40) return "from-amber-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getHealthMessage = () => {
    if (plantHealth >= 80) return "Thriving! Keep up the consistent study! �";
    if (plantHealth >= 60)
      return "Blooming! Study regularly to maintain growth! 🌻";
    if (plantHealth >= 40) return "Growing! Try to study more often! 🌿";
    return "Needs tending! Your garden needs regular care! 💧";
  };

  return (
    <div
      className={`bg-linear-to-br ${getHealthColor()}/10 border-2 rounded-2xl p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${getHealthColor()} flex items-center justify-center shadow-lg`}
        >
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600">Plant Health</p>
          <p className="text-2xl font-bold text-slate-900">{plantHealth}%</p>
        </div>
      </div>
      <div className="h-3 bg-white rounded-full overflow-hidden mb-3 shadow-inner">
        <div
          className={`h-full bg-linear-to-r ${getHealthColor()} rounded-full transition-all duration-1000`}
          style={{ width: `${plantHealth}%` }}
        />
      </div>
      <p className="text-sm text-slate-700 font-medium">{getHealthMessage()}</p>
    </div>
  );
};
