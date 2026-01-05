/**
 * Garden Dashboard Component
 * Visual representation of student's learning journey using garden metaphor
 * Shows overall garden health and individual topic growth stages
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, Leaf, Flower2, TreeDeciduous, Sparkles } from "lucide-react";
import type { GardenStage } from "../types";

export interface GardenTopic {
  name: string;
  gardenStage: GardenStage;
  masteryLevel: number;
  encouragement?: string;
  timeToNextStage?: number;
}

interface GardenDashboardProps {
  gardenHealth: number;
  encouragement?: string;
  topics: GardenTopic[];
  isLoading?: boolean;
}

/**
 * Get plant icon component based on garden stage
 */
const getPlantIcon = (stage: GardenStage) => {
  switch (stage) {
    case "🌱":
      return <Sprout className="w-8 h-8 text-green-600" />;
    case "🌿":
      return <Leaf className="w-8 h-8 text-green-600" />;
    case "🌻":
      return <Flower2 className="w-8 h-8 text-amber-500" />;
    case "🌳":
      return <TreeDeciduous className="w-8 h-8 text-emerald-700" />;
  }
};

/**
 * Get background gradient based on garden stage
 */
const getPlantBgGradient = (stage: GardenStage): string => {
  switch (stage) {
    case "🌱":
      return "from-green-50 to-emerald-50";
    case "🌿":
      return "from-green-100 to-emerald-100";
    case "🌻":
      return "from-amber-50 to-yellow-50";
    case "🌳":
      return "from-emerald-100 to-green-200";
  }
};

/**
 * Get stage label with warm language
 */
const getStageLabel = (stage: GardenStage): string => {
  switch (stage) {
    case "🌱":
      return "Seedling";
    case "🌿":
      return "Growing";
    case "🌻":
      return "Blooming";
    case "🌳":
      return "Thriving";
  }
};

/**
 * Get encouraging message based on stage
 */
const getStageMessage = (stage: GardenStage): string => {
  switch (stage) {
    case "🌱":
      return "Your seedling is sprouting!";
    case "🌿":
      return "Growing steadily";
    case "🌻":
      return "Blooming beautifully";
    case "🌳":
      return "Thriving with full mastery!";
  }
};

/**
 * Get overall garden health gradient
 */
const getGardenHealthGradient = (health: number): string => {
  if (health >= 75) return "from-emerald-50 via-green-50 to-lime-50";
  if (health >= 60) return "from-green-50 via-emerald-50 to-teal-50";
  if (health >= 40) return "from-lime-50 via-yellow-50 to-green-50";
  return "from-yellow-50 via-green-50 to-emerald-50";
};

/**
 * Get health text color
 */
const getHealthTextColor = (health: number): string => {
  if (health >= 75) return "text-emerald-700";
  if (health >= 60) return "text-green-700";
  if (health >= 40) return "text-lime-700";
  return "text-green-600";
};

/**
 * Get health icon
 */
const getHealthIcon = (health: number) => {
  if (health >= 75)
    return <TreeDeciduous className="w-10 h-10 text-emerald-700" />;
  if (health >= 60) return <Flower2 className="w-10 h-10 text-green-600" />;
  if (health >= 40) return <Leaf className="w-10 h-10 text-lime-600" />;
  return <Sprout className="w-10 h-10 text-green-600" />;
};

export function GardenDashboard({
  gardenHealth,
  encouragement,
  topics,
  isLoading,
}: GardenDashboardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort topics: seedlings first (need most attention), then by stage
  const sortedTopics = [...topics].sort((a, b) => {
    const stageOrder = { "🌱": 0, "🌿": 1, "🌻": 2, "🌳": 3 };
    return stageOrder[a.gardenStage] - stageOrder[b.gardenStage];
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span>Your Learning Garden</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Garden Health */}
        <div
          className={`bg-gradient-to-br ${getGardenHealthGradient(
            gardenHealth
          )} rounded-xl p-6 border-2 border-green-200/60 shadow-sm`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">{getHealthIcon(gardenHealth)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-700">
                  Garden Health
                </h3>
                <span
                  className={`text-2xl font-bold ${getHealthTextColor(
                    gardenHealth
                  )}`}
                >
                  {gardenHealth}%
                </span>
              </div>
              {encouragement && (
                <p className="text-base text-slate-700 leading-relaxed">
                  {encouragement}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${gardenHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Individual Topic Plants */}
        {sortedTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Your Garden Plants ({sortedTopics.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTopics.map((topic, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${getPlantBgGradient(
                    topic.gardenStage
                  )} rounded-lg p-4 border border-green-200/40 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getPlantIcon(topic.gardenStage)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                        {topic.name}
                      </h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{topic.gardenStage}</span>
                        <span className="text-xs font-medium text-slate-600">
                          {getStageLabel(topic.gardenStage)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        {topic.encouragement ||
                          getStageMessage(topic.gardenStage)}
                      </p>

                      {/* Mastery Level Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Mastery</span>
                          <span className="font-medium text-slate-700">
                            {topic.masteryLevel}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 rounded-full"
                            style={{ width: `${topic.masteryLevel}%` }}
                          />
                        </div>
                      </div>

                      {/* Time to Next Stage */}
                      {topic.timeToNextStage !== undefined &&
                        topic.gardenStage !== "🌳" && (
                          <p className="text-xs text-slate-500 mt-2 italic">
                            ~{topic.timeToNextStage} min to next stage
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedTopics.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Ready to plant your garden?
            </h3>
            <p className="text-sm text-gray-600">
              Complete a quiz to start growing your learning garden
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
