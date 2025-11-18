import React from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrev,
  onSkip,
  onClose,
  canGoNext,
  canGoPrev,
  isLastStep,
  actionButton,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium mb-2 text-blue-100">
            <span>Step {currentStep + 1}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-blue-100">{description}</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 shrink-0">
          <div
            className="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content - Scrollable */}
        <div className="p-8 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex gap-2">
            {canGoPrev && (
              <button
                onClick={onPrev}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={onSkip}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Skip Tour
            </button>
          </div>

          <div className="flex gap-2">
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="px-6 py-2.5 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                {actionButton.label}
              </button>
            )}
            {!isLastStep ? (
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`flex items-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all ${
                  canGoNext
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg active:scale-95"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
              >
                <span>Get Started!</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
