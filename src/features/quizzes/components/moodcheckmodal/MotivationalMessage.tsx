import React from "react";
import { Zap } from "lucide-react";
import type { Mood } from "../../types/quiz";

interface MotivationalMessageProps {
  selectedMood: Mood | null;
}

export const MotivationalMessage: React.FC<MotivationalMessageProps> = ({
  selectedMood,
}) => {
  if (!selectedMood) return null;

  return (
    <div className="mb-6 p-4 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl animate-in slide-in-from-top duration-300">
      <div className="flex items-start gap-3">
        <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-1">
            {selectedMood === "confident" &&
              "Fantastic! Your garden is thriving! Keep that momentum going! 🌳"}
            {selectedMood === "okay" &&
              "You're doing well! Keep nurturing your knowledge! 🌿"}
            {selectedMood === "struggling" &&
              "That's okay! Every garden needs care. We'll adjust to help you succeed! �"}
            {selectedMood === "confused" &&
              "No worries! We'll provide more support to help your garden grow! 💧"}
          </p>
          <p className="text-xs text-slate-600">
            We'll adapt the remaining questions based on your feedback.
          </p>
        </div>
      </div>
    </div>
  );
};
