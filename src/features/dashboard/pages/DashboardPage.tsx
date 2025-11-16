import { useAuth } from "@/features/auth/hooks/useAuth";
import { Book, TrendingUp, Target } from "lucide-react";
import { useOverallGardenHealth } from "@/features/quizzes/hooks/useOverallGardenHealth";
import { GardenHealthCard } from "@/features/quizzes/components/garden/GardenHealthCard";

export default function DashboardPage() {
  const { profile } = useAuth();
  const {
    health,
    emoticon,
    statusLabel,
    isLoading: gardenLoading,
  } = useOverallGardenHealth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {profile?.first_name || "Student"}! 👋
        </h1>
        <p className="text-slate-600">Here's your study overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Subjects */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Subjects
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">0</p>
          <p className="text-sm text-slate-600">Active subjects</p>
        </div>

        {/* Garden Health */}
        <GardenHealthCard
          health={health}
          emoticon={emoticon}
          statusLabel={statusLabel}
          isLoading={gardenLoading}
        />

        {/* Average Score */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Performance
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">--%</p>
          <p className="text-sm text-slate-600">Average score</p>
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Progress
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">0</p>
          <p className="text-sm text-slate-600">Quizzes completed</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-slate-200/60 shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Ready to start studying?
          </h2>
          <p className="text-slate-600 mb-6">
            Create your first subject to begin generating quizzes and tracking
            your progress.
          </p>
          <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
            Create Your First Subject
          </button>
        </div>
      </div>
    </div>
  );
}
