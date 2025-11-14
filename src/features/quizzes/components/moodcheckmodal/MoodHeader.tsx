import React from "react";
import { Brain } from "lucide-react";

export const MoodHeader: React.FC = () => {
  return (
    <div className="px-6 lg:px-8 pt-8 pb-6 border-b border-slate-200 bg-linear-to-br from-blue-50 to-indigo-50 rounded-t-3xl">
      <div className="text-center">
        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
          Quick Check-In
        </h2>
        <p className="text-slate-600 text-sm lg:text-base">
          You're halfway through! Let's see how you're feeling.
        </p>
      </div>
    </div>
  );
};
