import React, { useState, useEffect } from "react";
import {
  Sprout,
  Leaf,
  Flower2,
  Trophy,
  TrendingUp,
  Droplets,
  Sun,
} from "lucide-react";
import { GardenHeader } from "./GardenHeader";
import { PointsCelebration } from "./PointsCelebration";
import { PlantVisualization } from "./PlantVisualization";
import { LevelProgress } from "./LevelProgress";
import { PlantHealth } from "./PlantHealth";
import { MotivationalFooter } from "./MotivationalFooter";

interface GardenProgressProps {
  subject: string;
  subjectColor: string;
  level: number;
  progress: number; // 0-100
  pointsEarned: number;
  plantHealth: number; // 0-100 (consistency)
  onClose: () => void;
}

export const GardenProgress: React.FC<GardenProgressProps> = (props) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(
    props.progress - props.pointsEarned / 10
  );

  useEffect(() => {
    setTimeout(() => {
      setDisplayProgress(props.progress);
    }, 300);
    setTimeout(() => {
      setShowAnimation(true);
    }, 800);
  }, [props.progress]);

  const getPlantPlant = () => {
    if (props.level <= 1)
      return { icon: Sprout, label: "Seedling", color: "text-green-500" };
    if (props.level <= 3)
      return { icon: Leaf, label: "Young Plant", color: "text-green-600" };
    if (props.level <= 5)
      return { icon: Flower2, label: "Flowering", color: "text-pink-600" };
    return { icon: Trophy, label: "Thriving", color: "text-amber-600" };
  };

  const plantStage = getPlantPlant();
  const leveledUp = props.progress >= 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4"
      onClick={props.onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <GardenHeader
          subjectColor={props.subjectColor}
          subject={props.subject}
          onClose={props.onClose}
        />
        <div className="px-6 lg:px-8 py-8 space-y-6">
          <PointsCelebration
            showAnimation={showAnimation}
            pointsEarned={props.pointsEarned}
          />
          <PlantVisualization
            plantIcon={plantStage.icon}
            plantColor={plantStage.color}
            showAnimation={showAnimation}
          />
          <LevelProgress
            subjectColor={props.subjectColor}
            level={props.level}
            displayProgress={displayProgress}
            leveledUp={leveledUp}
          />
          <PlantHealth plantHealth={props.plantHealth} />
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Watering
              </p>
              <p className="text-lg font-bold text-slate-900">Daily</p>
            </div>
            <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 text-center">
              <Sun className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Sunlight
              </p>
              <p className="text-lg font-bold text-slate-900">Full</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600 mb-1">
                Growth
              </p>
              <p className="text-lg font-bold text-slate-900">Strong</p>
            </div>
          </div>
          <MotivationalFooter />
          <button
            onClick={props.onClose}
            className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
