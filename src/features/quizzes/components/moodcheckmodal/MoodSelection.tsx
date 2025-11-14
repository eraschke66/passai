import React from "react";
import type { Mood, MoodOption } from "../../types/quiz";

interface MoodSelectionProps {
  moodOptions: MoodOption[];
  selectedMood: Mood | null;
  setSelectedMood: (mood: Mood) => void;
}

export const MoodSelection: React.FC<MoodSelectionProps> = ({
  moodOptions,
  selectedMood,
  setSelectedMood,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-900 mb-3">
        How are you feeling about the quiz so far?
      </label>
      <div className="grid grid-cols-2 gap-3">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`relative p-4 rounded-xl border-2 transition-all active:scale-95 ${
                isSelected
                  ? `bg-linear-to-br ${mood.color} text-white border-transparent shadow-lg`
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-4xl mb-2 ${
                    isSelected ? "scale-110" : ""
                  } transition-transform`}
                >
                  {mood.emoji}
                </div>
                <p
                  className={`text-sm font-bold ${
                    isSelected ? "text-white" : "text-slate-900"
                  }`}
                >
                  {mood.label}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
