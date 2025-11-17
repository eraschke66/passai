import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickInsight {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  action?: {
    label: string;
    path: string;
  };
}

interface Subject {
  id: string;
  name: string;
  pass_chance: number | null;
}

interface QuickInsightsProps {
  subjects?: Subject[];
}

export const QuickInsights = ({ subjects }: QuickInsightsProps) => {
  const navigate = useNavigate();

  if (!subjects || subjects.length === 0) {
    return null;
  }

  const insights: QuickInsight[] = [];

  // Check for improving subjects
  const improvingSubjects = subjects.filter((s) => (s.pass_chance || 0) >= 70);
  if (improvingSubjects.length > 0) {
    insights.push({
      type: "success",
      title: `${improvingSubjects.length} subject${
        improvingSubjects.length > 1 ? "s" : ""
      } looking strong!`,
      description: `You're on track with ${improvingSubjects
        .map((s) => s.name)
        .join(", ")}. Keep up the great work!`,
    });
  }

  // Check for subjects needing attention
  const needsAttention = subjects.filter(
    (s) => (s.pass_chance || 0) > 0 && (s.pass_chance || 0) < 50
  );
  if (needsAttention.length > 0) {
    insights.push({
      type: "warning",
      title: `${needsAttention.length} subject${
        needsAttention.length > 1 ? "s need" : " needs"
      } extra practice`,
      description: `Focus some time on ${needsAttention
        .map((s) => s.name)
        .join(", ")} to boost your confidence.`,
      action: {
        label: "Take a quiz",
        path: "/quizzes",
      },
    });
  }

  // Encourage quiz taking if no recent activity
  if (subjects.every((s) => !s.pass_chance || s.pass_chance === 0)) {
    insights.push({
      type: "info",
      title: "Ready to gauge your knowledge?",
      description:
        "Take your first quiz to get personalized insights and track your progress.",
      action: {
        label: "Start now",
        path: "/quizzes",
      },
    });
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl border-2 ${
            insight.type === "success"
              ? "bg-emerald-50 border-emerald-200"
              : insight.type === "warning"
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 ${
                insight.type === "success"
                  ? "text-emerald-600"
                  : insight.type === "warning"
                  ? "text-amber-600"
                  : "text-blue-600"
              }`}
            >
              {insight.type === "success" ? (
                <TrendingUp className="w-5 h-5" />
              ) : insight.type === "warning" ? (
                <TrendingDown className="w-5 h-5" />
              ) : (
                <Minus className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-bold text-sm mb-1 ${
                  insight.type === "success"
                    ? "text-emerald-900"
                    : insight.type === "warning"
                    ? "text-amber-900"
                    : "text-blue-900"
                }`}
              >
                {insight.title}
              </h3>
              <p
                className={`text-sm ${
                  insight.type === "success"
                    ? "text-emerald-700"
                    : insight.type === "warning"
                    ? "text-amber-700"
                    : "text-blue-700"
                }`}
              >
                {insight.description}
              </p>
              {insight.action && (
                <button
                  onClick={() => navigate(insight.action!.path)}
                  className={`mt-3 text-sm font-semibold underline ${
                    insight.type === "success"
                      ? "text-emerald-700 hover:text-emerald-800"
                      : insight.type === "warning"
                      ? "text-amber-700 hover:text-amber-800"
                      : "text-blue-700 hover:text-blue-800"
                  }`}
                >
                  {insight.action.label} →
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
