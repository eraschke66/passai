import { useState, useEffect } from "react";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { SubjectSelector } from "../components/SubjectSelector";
import { StatsCards } from "../components/StatsCards";
import { ProgressBar } from "../components/ProgressBar";
import { StudySchedule } from "../components/StudySchedule";
import { NoQuizAttemptsState } from "../components/NoQuizAttemptsState";
import { NoStudyPlanState } from "../components/NoStudyPlanState";
import { GenerateStudyPlanModal } from "../components/GenerateStudyPlanModal";
import { useStudyPlan, useStudyPlans } from "../hooks/useStudyPlan";
import { useGenerateStudyPlan } from "../hooks/useGenerateStudyPlan";
import { getCompletedQuizAttemptsForSubject } from "../services/studyPlanService";
import type { Subject } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StudyPlanPage = () => {
  const { data: subjects = [] } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [hasQuizAttempts, setHasQuizAttempts] = useState<boolean | null>(null);
  const [checkingQuizAttempts, setCheckingQuizAttempts] = useState(false);

  // Fetch study plans for selected subject
  const {
    data: studyPlans = [],
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
    error: plansError,
    refetch: refetchPlans,
  } = useStudyPlans(selectedSubject?.id);

  // Get the active study plan (first one)
  const activeStudyPlan = studyPlans[0] || null;

  // Initialize study plan hook
  const studyPlanHook = useStudyPlan(activeStudyPlan);

  // Generate study plan mutation
  const { mutate: generatePlan, isPending: isGenerating } =
    useGenerateStudyPlan();

  // Pre-select first subject when subjects are loaded
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  // Store quiz attempt data
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);

  // Check if user has completed quiz attempts when subject changes
  useEffect(() => {
    const checkQuizAttempts = async () => {
      if (!selectedSubject?.id) {
        setHasQuizAttempts(null);
        setQuizAttemptId(null);
        return;
      }

      setCheckingQuizAttempts(true);
      try {
        const result = await getCompletedQuizAttemptsForSubject(
          selectedSubject.id
        );
        setHasQuizAttempts(result.hasAttempts);
        setQuizAttemptId(result.latestAttempt?.id || null);
      } catch (error) {
        console.error("Error checking quiz attempts:", error);
        setHasQuizAttempts(false);
        setQuizAttemptId(null);
      } finally {
        setCheckingQuizAttempts(false);
      }
    };

    checkQuizAttempts();
  }, [selectedSubject]);

  // Check if test date is in the future
  const isTestDateInFuture = (testDate: string | null): boolean => {
    if (!testDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const test = new Date(testDate);
    test.setHours(0, 0, 0, 0);
    return test > today;
  };

  const hasValidTestDate =
    selectedSubject?.test_date && isTestDateInFuture(selectedSubject.test_date);

  // Handle generate plan
  const handleGeneratePlan = (settings: { availableHoursPerWeek: number }) => {
    if (
      !selectedSubject?.id ||
      !selectedSubject.test_date ||
      !selectedSubject.name ||
      !quizAttemptId
    )
      return;

    // Validate test date is in the future
    if (!isTestDateInFuture(selectedSubject.test_date)) {
      return;
    }

    generatePlan(
      {
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        testDate: selectedSubject.test_date,
        availableHoursPerWeek: settings.availableHoursPerWeek,
        currentPassChance: selectedSubject.pass_chance,
        quizAttemptId: quizAttemptId,
      },
      {
        onSuccess: () => {
          setShowGenerateModal(false);
        },
      }
    );
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="px-4 py-4 lg:px-8 lg:py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="px-4 py-4 lg:px-8 lg:py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Error Loading Study Plan
          </h3>
          <p className="text-slate-600 mb-4">
            {plansError instanceof Error
              ? plansError.message
              : "We couldn't load your study plan. Please try again."}
          </p>
          <Button onClick={() => refetchPlans()} variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-linear-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          {/* Page Title and Description */}
          <div className="mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
              My Study Plan
            </h1>
            <p className="text-sm lg:text-base text-slate-600">
              Track your progress and follow your personalized study schedule
            </p>
          </div>

          {/* Subject Selector */}
          <SubjectSelector
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            isOpen={isSubjectDropdownOpen}
            onToggle={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
          />

          {/* Stats Cards - only show if we have a study plan */}
          {activeStudyPlan && (
            <StatsCards
              passChance={selectedSubject?.pass_chance || null}
              testDate={selectedSubject?.test_date || null}
            />
          )}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {(isLoadingPlans || checkingQuizAttempts) && renderLoadingState()}

          {/* Error State */}
          {isErrorPlans && !isLoadingPlans && renderErrorState()}

          {/* No Quiz Attempts State */}
          {!isLoadingPlans &&
            !checkingQuizAttempts &&
            !isErrorPlans &&
            hasQuizAttempts === false && (
              <NoQuizAttemptsState
                subjectName={selectedSubject?.name || "this subject"}
              />
            )}

          {/* No Study Plan State */}
          {!isLoadingPlans &&
            !checkingQuizAttempts &&
            !isErrorPlans &&
            hasQuizAttempts === true &&
            !activeStudyPlan && (
              <>
                {hasValidTestDate ? (
                  <NoStudyPlanState
                    subjectName={selectedSubject?.name || "this subject"}
                    onGeneratePlan={() => setShowGenerateModal(true)}
                    isGenerating={isGenerating}
                  />
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Test Date Required
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {selectedSubject?.test_date
                          ? "The test date for this subject has already passed. Please update the test date to generate a new study plan."
                          : "Please set a future test date for this subject to generate a study plan."}
                      </p>
                      <Button
                        onClick={() => {
                          /* Navigate to settings or subject edit */
                        }}
                        variant="outline"
                      >
                        Update Test Date
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

          {/* Study Plan Content */}
          {!isLoadingPlans &&
            !checkingQuizAttempts &&
            !isErrorPlans &&
            activeStudyPlan &&
            studyPlanHook && (
              <>
                {/* Progress Bar */}
                <ProgressBar
                  completed={studyPlanHook.completedTasks}
                  total={studyPlanHook.totalTasks}
                />

                {/* Study Schedule */}
                <StudySchedule
                  topics={studyPlanHook.studyPlan?.topics || []}
                  expandedTopics={studyPlanHook.expandedTopics}
                  onToggleTopic={studyPlanHook.toggleTopic}
                  onToggleTask={studyPlanHook.toggleTask}
                />
              </>
            )}
        </div>
      </div>

      {/* Generate Study Plan Modal */}
      {showGenerateModal && selectedSubject && (
        <GenerateStudyPlanModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGeneratePlan}
          subjectName={selectedSubject.name}
          testDate={selectedSubject.test_date || ""}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};
