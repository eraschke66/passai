import { useAuth } from "@/features/auth/hooks/useAuth";
import { Book, Target } from "lucide-react";
import { useOverallGardenHealth } from "@/features/quizzes/hooks/useOverallGardenHealth";
import { GardenHealthCard } from "@/features/quizzes/components/garden/GardenHealthCard";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { SubjectsCarousel } from "../components/SubjectsCarousel";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { QuizCallToAction } from "../components/QuizCallToAction";
import { QuickInsights } from "../components/QuickInsights";
import { OnboardingFlow } from "@/features/onboarding";

export default function DashboardPage() {
  const { profile } = useAuth();
  const {
    health,
    emoticon,
    statusLabel,
    isLoading: gardenLoading,
  } = useOverallGardenHealth();

  const { data: subjects } = useSubjects();

  // Calculate stats from subjects
  const totalSubjects = subjects?.length || 0;
  const averagePassChance =
    subjects && subjects.length > 0
      ? Math.round(
          subjects.reduce((sum, s) => sum + (s.pass_chance || 0), 0) /
            subjects.length
        )
      : 0;

  const hasSubjects = subjects && subjects.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Onboarding Flow */}
      <OnboardingFlow />

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {profile?.first_name || "Student"}! 👋
        </h1>
        <p className="text-slate-600">
          {hasSubjects
            ? "Here's your study overview for today"
            : "Let's get started with your learning journey"}
        </p>
      </div>

      {/* Stats Grid - Only show if user has subjects */}
      {hasSubjects && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {totalSubjects}
            </p>
            <p className="text-sm text-slate-600">Active subjects</p>
          </div>

          {/* Garden Health */}
          <GardenHealthCard
            health={health}
            emoticon={emoticon}
            statusLabel={statusLabel}
            isLoading={gardenLoading}
          />

          {/* Average Pass Chance */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Average Pass
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {averagePassChance}%
            </p>
            <p className="text-sm text-slate-600">Across all subjects</p>
          </div>
        </div>
      )}

      {/* Subjects Carousel */}
      <div className="mb-8">
        <SubjectsCarousel />
      </div>

      {/* Upcoming Tasks & Quiz CTA */}
      {hasSubjects && (
        <div className="space-y-8">
          {/* Quick Insights */}
          <QuickInsights subjects={subjects} />

          {/* Study Plan Tasks */}
          <UpcomingTasks />

          {/* Quiz Call to Action */}
          <QuizCallToAction />
        </div>
      )}
    </div>
  );
}
