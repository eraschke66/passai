/**
 * Garden Growth Celebration Component
 * Shows before/after garden stages when mastery improves after quiz completion
 */

import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { GardenStage } from "@/features/study/types";

interface TopicGrowth {
  topicName: string;
  beforeStage: GardenStage;
  afterStage: GardenStage;
  beforeMastery: number;
  afterMastery: number;
  improved: boolean;
}

interface GardenGrowthCelebrationProps {
  topicGrowths: TopicGrowth[];
  overallScore: number;
  subjectName: string;
}

/**
 * Get stage name and description
 */
const getStageInfo = (stage: GardenStage) => {
  switch (stage) {
    case "🌱":
      return { name: "Seedling", color: "text-green-600" };
    case "🌿":
      return { name: "Growing", color: "text-green-700" };
    case "🌻":
      return { name: "Blooming", color: "text-amber-600" };
    case "🌳":
      return { name: "Thriving", color: "text-emerald-700" };
  }
};

/**
 * Map mastery level to garden stage
 */
export const getMasteryStage = (masteryLevel: number): GardenStage => {
  if (masteryLevel < 40) return "🌱";
  if (masteryLevel < 60) return "🌿";
  if (masteryLevel < 75) return "🌻";
  return "🌳";
};

/**
 * Garden Growth Celebration Component
 */
export function GardenGrowthCelebration({
  topicGrowths,
  overallScore,
  subjectName,
}: GardenGrowthCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter to only show improved topics
  const improvedTopics = topicGrowths.filter((t) => t.improved);

  if (improvedTopics.length === 0) return null;

  const getEncouragementMessage = () => {
    const count = improvedTopics.length;
    if (overallScore >= 90) {
      return `Incredible! ${count} ${
        count === 1 ? "plant" : "plants"
      } grew stronger! Your garden is flourishing! 🌳`;
    }
    if (overallScore >= 75) {
      return `Wonderful! ${count} ${
        count === 1 ? "plant is" : "plants are"
      } blooming with your care! 🌻`;
    }
    if (overallScore >= 60) {
      return `Great work! ${count} ${
        count === 1 ? "plant" : "plants"
      } grew today. Keep watering! 🌿`;
    }
    return `Your garden is growing! ${count} ${
      count === 1 ? "seedling" : "seedlings"
    } improved! 🌱`;
  };

  return (
    <div
      className={`transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl border-2 border-green-200 p-6 lg:p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              Your Garden Grew!
              <TrendingUp className="w-6 h-6 text-green-600" />
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              {getEncouragementMessage()}
            </p>
          </div>
        </div>

        {/* Topic Growth List */}
        <div className="space-y-3">
          {improvedTopics.map((topic, index) => {
            const beforeInfo = getStageInfo(topic.beforeStage);
            const afterInfo = getStageInfo(topic.afterStage);
            const masteryGain = topic.afterMastery - topic.beforeMastery;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible
                    ? "slideInRight 0.5s ease-out forwards"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Before Stage */}
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">{topic.beforeStage}</span>
                    <span className={`text-xs font-medium ${beforeInfo.color}`}>
                      {beforeInfo.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {topic.beforeMastery}%
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight className="w-6 h-6 text-green-600" />
                  </div>

                  {/* After Stage */}
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">{topic.afterStage}</span>
                    <span className={`text-xs font-medium ${afterInfo.color}`}>
                      {afterInfo.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {topic.afterMastery}%
                    </span>
                  </div>

                  {/* Topic Info */}
                  <div className="flex-1 ml-2">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {topic.topicName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-700 font-medium">
                        +{masteryGain}% mastery
                      </span>
                      {topic.beforeStage !== topic.afterStage && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Level up!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-green-200">
          <p className="text-sm text-slate-600 text-center">
            Keep taking quizzes to grow your {subjectName} garden! 🌱→🌳
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
