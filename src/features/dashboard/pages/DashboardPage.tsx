import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { QuizCallToAction } from "../components/QuizCallToAction";
import { OnboardingFlow } from "@/features/onboarding";
import { SubjectCard } from "../components/SubjectCard";
import { SubjectCardSkeleton } from "../components/SubjectCardSkeleton";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data: subjects, isLoading } = useSubjects();

  const hasSubjects = subjects && subjects.length > 0;

  // Calculate average pass chance for the welcome message
  const averagePassChance =
    subjects && subjects.length > 0
      ? Math.round(
          subjects.reduce((sum, s) => sum + (s.pass_chance || 0), 0) /
            subjects.length
        )
      : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Onboarding Flow */}
      <OnboardingFlow />

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {profile?.first_name || "Student"}!
        </h1>
        <p className="text-slate-600">
          {hasSubjects
            ? `You have a ${averagePassChance}% average pass chance across your subjects.`
            : "Let's plant the seeds of your learning journey"}
        </p>
      </div>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <SubjectCardSkeleton key={i} />
          ))}
        </div>
      ) : hasSubjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : null}

      {/* Quiz Call to Action */}
      <div className="mt-auto">
        <QuizCallToAction />
      </div>
    </div>
  );
}
