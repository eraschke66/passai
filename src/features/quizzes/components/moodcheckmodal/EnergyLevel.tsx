import React from "react";
import { Coffee } from "lucide-react";

interface EnergyLevelProps {
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
}

export const EnergyLevel: React.FC<EnergyLevelProps> = ({
  energyLevel,
  setEnergyLevel,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-900 mb-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-slate-600" />
          <span>Energy Level</span>
        </div>
      </label>
      <div className="px-2">
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
              energyLevel * 10
            }%, rgb(226, 232, 240) ${
              energyLevel * 10
            }%, rgb(226, 232, 240) 100%)`,
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-600 font-medium">Tired</span>
          <span className="text-sm font-bold text-blue-600">
            {energyLevel}/10
          </span>
          <span className="text-xs text-slate-600 font-medium">Energized</span>
        </div>
      </div>
    </div>
  );
};
