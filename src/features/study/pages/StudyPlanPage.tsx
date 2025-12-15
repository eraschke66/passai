import { Construction } from "lucide-react";

export const StudyPlanPage = () => {
  return (
    <div className="h-full overflow-y-auto">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
              My Study Plan
            </h1>
            <p className="text-sm lg:text-base text-slate-600">
              Track your progress and follow your personalized study schedule
            </p>
          </div>
        </div>
      </div>

      {/* Under Construction Content */}
      <div className="px-4 py-8 lg:px-8 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 lg:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full mb-6">
              <Construction className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3">
              Under Construction
            </h2>
            <p className="text-sm lg:text-base text-slate-600 mb-2">
              We're working on bringing you an amazing study planning
              experience.
            </p>
            <p className="text-sm text-slate-500">
              This feature will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
