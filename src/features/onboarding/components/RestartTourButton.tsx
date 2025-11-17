import React from "react";
import { HelpCircle, RotateCcw } from "lucide-react";
import { useOnboarding } from "../hooks/useOnboarding";

export const RestartTourButton: React.FC<{ variant?: "full" | "icon" }> = ({
  variant = "full",
}) => {
  const { resetOnboarding } = useOnboarding();

  if (variant === "icon") {
    return (
      <button
        onClick={resetOnboarding}
        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        title="Restart Tour"
      >
        <HelpCircle className="w-5 h-5 text-slate-600" />
      </button>
    );
  }

  return (
    <button
      onClick={resetOnboarding}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      <span>Restart Tour</span>
    </button>
  );
};
