import React from "react";
import { Sparkles, Sun } from "lucide-react";

interface PlantVisualizationProps {
  plantIcon: React.ElementType;
  plantColor: string;
  showAnimation: boolean;
}

export const PlantVisualization: React.FC<PlantVisualizationProps> = ({
  plantIcon: PlantIcon,
  plantColor,
  showAnimation,
}) => {
  return (
    <div className="relative">
      <div className="w-full h-64 bg-linear-to-b from-sky-100 to-green-50 rounded-2xl border-2 border-slate-200 overflow-hidden relative">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-amber-100 to-amber-200" />
        <Sun className="absolute top-6 right-6 w-12 h-12 text-amber-400 animate-pulse" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div
            className={`${
              showAnimation
                ? "animate-in zoom-in-95 duration-1000"
                : "opacity-0"
            }`}
          >
            <PlantIcon
              className={`w-24 h-24 lg:w-32 lg:h-32 ${plantColor} drop-shadow-lg`}
            />
          </div>
          {showAnimation && (
            <>
              <Sparkles className="absolute -top-4 -left-6 w-6 h-6 text-amber-400 animate-ping" />
              <Sparkles className="absolute -top-6 right-0 w-5 h-5 text-green-400 animate-ping delay-100" />
              <Sparkles className="absolute top-2 -right-8 w-4 h-4 text-pink-400 animate-ping delay-200" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
