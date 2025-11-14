import React from "react";
import {
  Brain,
  BookOpen,
  Lightbulb,
  FileText,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import type { GenerationStep } from "../../types/quiz";

interface GeneratingProgressProps {
  generationProgress: GenerationStep;
  isLoading?: boolean;
}

const generationSteps = [
  {
    step: "analyzing-materials" as GenerationStep,
    label: "Analyzing your materials",
    icon: BookOpen,
  },
  {
    step: "identifying-topics" as GenerationStep,
    label: "Identifying key topics",
    icon: Lightbulb,
  },
  {
    step: "generating-questions" as GenerationStep,
    label: "Generating questions",
    icon: Brain,
  },
  {
    step: "creating-explanations" as GenerationStep,
    label: "Creating explanations",
    icon: FileText,
  },
  {
    step: "finalizing" as GenerationStep,
    label: "Finalizing your quiz",
    icon: Sparkles,
  },
  { step: "complete" as GenerationStep, label: "Quiz ready!", icon: Check },
];

export const GeneratingProgress: React.FC<GeneratingProgressProps> = ({
  generationProgress,
  isLoading = false,
}) => {
  const currentStepIndex = generationSteps.findIndex(
    (s) => s.step === generationProgress
  );

  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse opacity-20" />
          {isLoading ? (
            <div className="absolute inset-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          ) : (
            <div className="absolute inset-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white animate-pulse" />
            </div>
          )}
          <div
            className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          {isLoading ? "Generating Your Quiz" : "Quiz Generated Successfully!"}
        </h3>
        <p className="text-slate-600 mb-8">
          {isLoading
            ? "Our AI is analyzing your materials and creating personalized questions"
            : "Your personalized quiz is ready"}
        </p>
        {isLoading ? (
          <div className="space-y-4">
            {generationSteps.map((item, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isComplete
                      ? "bg-emerald-50 border-2 border-emerald-200"
                      : isCurrent
                      ? "bg-blue-50 border-2 border-blue-500 scale-105"
                      : "bg-slate-50 border-2 border-slate-200 opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isComplete
                        ? "bg-emerald-600"
                        : isCurrent
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span
                    className={`font-semibold text-sm lg:text-base ${
                      isComplete
                        ? "text-emerald-700"
                        : isCurrent
                        ? "text-blue-700"
                        : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // Success state (if not loading, but since isLoading=false means complete, show a check or something
          <div className="flex justify-center">
            <Check className="w-16 h-16 text-emerald-600 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
};
