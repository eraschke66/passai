import React, { useState } from "react";
import { Brain, Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { MoodOption, Mood } from "../../types/quiz";
import { MoodHeader } from "./MoodHeader";
import { MoodSelection } from "./MoodSelection";
import { EnergyLevel } from "./EnergyLevel";
import { MotivationalMessage } from "./MotivationalMessage";

const moodOptions: MoodOption[] = [
  {
    id: "confident",
    emoji: "🎯",
    label: "Confident",
    color: "from-emerald-500 to-green-600",
    icon: Target,
  },
  {
    id: "okay",
    emoji: "👍",
    label: "Doing Okay",
    color: "from-blue-500 to-indigo-600",
    icon: TrendingUp,
  },
  {
    id: "struggling",
    emoji: "🤔",
    label: "Struggling",
    color: "from-amber-500 to-orange-600",
    icon: Brain,
  },
  {
    id: "confused",
    emoji: "😕",
    label: "Confused",
    color: "from-red-500 to-pink-600",
    icon: TrendingDown,
  },
];

interface MoodCheckModalProps {
  currentScore: number;
  onComplete: (mood: Mood) => void;
}

export const MoodCheckModal: React.FC<MoodCheckModalProps> = (props) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number>(5);

  const handleContinue = () => {
    if (selectedMood) {
      props.onComplete(selectedMood);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        <MoodHeader />
        <div className="px-6 lg:px-8 py-6 overflow-y-auto flex-1">
          <MoodSelection
            moodOptions={moodOptions}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />
          <EnergyLevel
            energyLevel={energyLevel}
            setEnergyLevel={setEnergyLevel}
          />
          <MotivationalMessage selectedMood={selectedMood} />
        </div>
        <div className="px-6 lg:px-8 pb-8 pt-4 border-t border-slate-100">
          <button
            onClick={handleContinue}
            disabled={!selectedMood}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span>Continue Quiz</span>
            <Zap className="w-5 h-5" />
          </button>
          <p className="text-xs text-center text-slate-500 mt-3">
            Your feedback helps us personalize your learning experience
          </p>
        </div>
      </div>
    </div>
  );
};
