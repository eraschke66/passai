import { Calendar, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Placeholder component - will be enhanced when study plan data is available
export const UpcomingTasks = () => {
  const navigate = useNavigate();

  // TODO: Fetch actual study plan tasks
  // For now, show a placeholder encouraging users to check their study plan

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Your Study Plan
        </h2>
        <button
          onClick={() => navigate("/study-plan")}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          View full plan
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-slate-200/60 shadow-lg">
        <div className="space-y-4">
          {/* Placeholder tasks - replace with actual data */}
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="mt-1">
              <Circle className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">
                Review key concepts
              </h4>
              <p className="text-sm text-slate-600">
                Complete assigned readings and take notes
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Today
                </span>
                <span className="text-xs text-slate-500">30 min</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors opacity-75">
            <div className="mt-1">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1 line-through">
                Practice problems
              </h4>
              <p className="text-sm text-slate-600">
                Work through example exercises
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors opacity-60">
            <div className="mt-1">
              <Circle className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">
                Take practice quiz
              </h4>
              <p className="text-sm text-slate-600">Test your understanding</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                  Tomorrow
                </span>
                <span className="text-xs text-slate-500">20 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => navigate("/study-plan")}
            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            View Your Complete Study Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
