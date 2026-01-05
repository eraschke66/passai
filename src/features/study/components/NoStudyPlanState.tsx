import React from "react";
import { Brain, Sparkles, Zap } from "lucide-react";

interface NoStudyPlanStateProps {
  subjectName: string;
  onGeneratePlan: () => void;
  isGenerating?: boolean;
}

export const NoStudyPlanState: React.FC<NoStudyPlanStateProps> = ({
  subjectName,
  onGeneratePlan,
  isGenerating = false,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
          Ready to Grow Your Learning Garden? 🌱
        </h2>

        {/* Description */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          Great news! You've completed a quiz for <strong>{subjectName}</strong>
          . Now we can grow a personalized learning garden based on your
          performance to help you bloom with confidence.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-left p-3 bg-green-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                🌱 Seedling Assessment
              </h4>
              <p className="text-xs text-slate-600">
                See which topics are sprouting and which need more water
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left p-3 bg-emerald-50 rounded-lg">
            <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                🌿 Growth Recommendations
              </h4>
              <p className="text-xs text-slate-600">
                Get specific tasks to help each topic grow and bloom
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left p-3 bg-lime-50 rounded-lg">
            <Brain className="w-5 h-5 text-lime-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                🌻 Garden Care Schedule
              </h4>
              <p className="text-xs text-slate-600">
                A balanced plan that fits your time and helps you thrive
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGeneratePlan}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Your Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Grow My Garden 🌱</span>
            </>
          )}
        </button>

        {isGenerating && (
          <p className="text-sm text-slate-500 mt-3">
            This may take a few moments...
          </p>
        )}
      </div>
    </div>
  );
};
