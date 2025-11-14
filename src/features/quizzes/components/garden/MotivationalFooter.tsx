import React from "react";
import { Zap } from "lucide-react";

export const MotivationalFooter: React.FC = () => {
  return (
    <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
      <Zap className="w-10 h-10 mx-auto mb-3 animate-bounce" />
      <p className="text-lg font-bold mb-2">Keep Growing! 🌱</p>
      <p className="text-sm text-white/90">
        Study consistently to keep your garden healthy and thriving!
      </p>
    </div>
  );
};
