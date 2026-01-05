/**
 * Garden Dashboard Usage Example
 *
 * This component demonstrates how to integrate the GardenDashboard
 * into the study plan flow with data from the Edge Function
 */

import { GardenDashboard, type GardenTopic } from "./GardenDashboard";
import type { GenerateStudyPlanEdgeResponse } from "../services/studyPlanEdgeService";

/**
 * Example: Using GardenDashboard with Edge Function response
 */
export function StudyPlanWithGarden({
  edgeResponse,
}: {
  edgeResponse: GenerateStudyPlanEdgeResponse;
}) {
  // Convert Edge Function topics to GardenTopic format
  const gardenTopics: GardenTopic[] = edgeResponse.studyPlan.topics.map(
    (topic) => ({
      name: topic.name,
      gardenStage: topic.gardenStage,
      masteryLevel: topic.masteryLevel,
      encouragement: topic.encouragement,
      timeToNextStage: topic.timeToNextStage,
    })
  );

  return (
    <div className="space-y-6">
      {/* Garden Dashboard */}
      <GardenDashboard
        gardenHealth={edgeResponse.metadata.gardenHealth}
        encouragement={edgeResponse.studyPlan.encouragement}
        topics={gardenTopics}
      />

      {/* Rest of study plan UI... */}
    </div>
  );
}

/**
 * Example: Using GardenDashboard with topic mastery data
 */
export function TopicMasteryGardenView({
  topics,
  gardenHealth,
}: {
  topics: Array<{
    topic_name: string;
    mastery_level: number;
  }>;
  gardenHealth: number;
}) {
  // Convert topic mastery to garden topics
  const gardenTopics: GardenTopic[] = topics.map((topic) => {
    // Map mastery level to garden stage
    let gardenStage: GardenTopic["gardenStage"];
    if (topic.mastery_level < 40) gardenStage = "🌱";
    else if (topic.mastery_level < 60) gardenStage = "🌿";
    else if (topic.mastery_level < 75) gardenStage = "🌻";
    else gardenStage = "🌳";

    return {
      name: topic.topic_name,
      gardenStage,
      masteryLevel: topic.mastery_level,
    };
  });

  return (
    <GardenDashboard
      gardenHealth={gardenHealth}
      topics={gardenTopics}
      encouragement={`Your garden is ${gardenHealth}% healthy and growing!`}
    />
  );
}

/**
 * Example: Loading state
 */
export function GardenLoadingState() {
  return <GardenDashboard gardenHealth={0} topics={[]} isLoading={true} />;
}
