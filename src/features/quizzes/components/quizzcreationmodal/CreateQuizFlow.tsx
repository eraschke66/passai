import React, { useState, useEffect } from "react";
import { X, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { useSubjects } from "../../hooks/useSubjects";
import { useMaterials } from "../../hooks/useMaterials";
import { useCreateQuiz } from "../../hooks/useCreateQuiz";
import type { QuizSettings, Subject } from "../../types/quiz";
import { SubjectSelection } from "./SubjectSelection";
import { MaterialSelection } from "./MaterialSelection";
import { QuizConfiguration } from "./QuizConfiguration";
import { GeneratingProgress } from "./GeneratingProgress";
import { ScheduleOptions } from "./ScheduleOptions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

interface CreateQuizFlowProps {
  onClose: () => void;
  onQuizCreated?: (quizId: string, scheduleTime?: string) => void;
  preSelectedSubject?: string;
}

export const CreateQuizFlow: React.FC<CreateQuizFlowProps> = ({
  onClose,
  onQuizCreated,
  preSelectedSubject,
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const { mutate: createNewQuiz, isPending: isGenerating } = useCreateQuiz(
    userId || ""
  );

  const { data: subjects = [] } = useSubjects();
  const { data: materials = [] } = useMaterials();

  const needsSubjectSelection = !preSelectedSubject;
  const [step, setStep] = useState<
    | "select-subject"
    | "select-materials"
    | "configure"
    | "generating"
    | "schedule"
  >(needsSubjectSelection ? "select-subject" : "select-materials");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    preSelectedSubject
      ? subjects.find((s) => s.name === preSelectedSubject) || null
      : null
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    customTitle: "",
    subjectName: selectedSubject ? selectedSubject.name : "",
    questionCount: 10,
    difficulty: "medium",
    timeLimit: 30,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: false,
      matching: false,
    },
    cognitiveMix: { recall: 30, understanding: 50, application: 20 },
    focusAreas: "",
  });
  const [scheduleOption, setScheduleOption] = useState<"now" | "later">("now");
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);

  const filteredMaterials = selectedSubject
    ? materials.filter((m) => m.subject_id === selectedSubject.id)
    : materials;

  useEffect(() => {
    if (step === "generating" && !isGenerating) {
      // Mutation complete; transition handled in onSuccess
    }
  }, [step, isGenerating]);

  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const selectAllMaterials = () =>
    setSelectedMaterials(filteredMaterials.map((m) => m.id));
  const deselectAllMaterials = () => setSelectedMaterials([]);

  const handleGenerateQuiz = () => {
    if (!selectedSubject || !userId) return;
    setStep("generating");
    createNewQuiz(
      {
        subjectId: selectedSubject.id,
        settings: quizSettings,
        materialIds: selectedMaterials,
      },
      {
        onSuccess: ({ quizId }) => {
          setCreatedQuizId(quizId);
          setStep("schedule");
          console.log("Quiz created with ID:", quizId);
        },
        onError: (error) => {
          console.error("Generation failed:", error);
          toast.error("Failed to generate quiz. Please try again.");
          // TODO: Optionally revert to configure
          setStep("configure");
        },
      }
    );
  };

  const handleScheduleQuiz = () => {
    if (!createdQuizId) return;
    if (scheduleOption === "now") {
      onQuizCreated?.(createdQuizId);
    } else {
      onQuizCreated?.(createdQuizId, scheduleDateTime);
    }
    onClose();
  };

  const canProceedFromSubject = !!selectedSubject;
  const canProceedFromMaterials = selectedMaterials.length > 0;
  const canSchedule =
    !!createdQuizId && (scheduleOption !== "later" || !!scheduleDateTime);

  const totalSteps = needsSubjectSelection ? 4 : 3;
  const currentStepNumber =
    step === "select-subject"
      ? 1
      : step === "select-materials"
      ? needsSubjectSelection
        ? 2
        : 1
      : step === "configure"
      ? needsSubjectSelection
        ? 3
        : 2
      : step === "schedule"
      ? totalSteps
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-4 lg:px-6 py-4 lg:py-5 border-b border-slate-200 bg-linear-to-br from-blue-500 to-indigo-600">
          <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-0.5">
                Create AI Quiz
              </h2>
              <p className="text-sm text-white/90">
                {step === "select-subject" && "Choose a subject"}
                {step === "select-materials" && "Select materials"}
                {step === "configure" && "Configure quiz details"}
                {step === "generating" && "Generating your quiz..."}
                {step === "schedule" && "Ready to start or schedule"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all shrink-0"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {step !== "generating" && (
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx < currentStepNumber ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "select-subject" && (
            <SubjectSelection
              subjects={subjects}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              materials={materials}
            />
          )}
          {step === "select-materials" && (
            <MaterialSelection
              selectedSubject={selectedSubject}
              filteredMaterials={filteredMaterials}
              selectedMaterials={selectedMaterials}
              toggleMaterialSelection={toggleMaterialSelection}
              selectAllMaterials={selectAllMaterials}
              deselectAllMaterials={deselectAllMaterials}
            />
          )}
          {step === "configure" && (
            <QuizConfiguration
              quizSettings={quizSettings}
              setQuizSettings={setQuizSettings}
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              selectedSubject={selectedSubject}
              selectedMaterials={selectedMaterials}
            />
          )}
          {step === "generating" && (
            <GeneratingProgress
              generationProgress={
                isGenerating ? "generating-questions" : "complete"
              }
              isLoading={isGenerating}
            />
          )}
          {step === "schedule" && (
            <ScheduleOptions
              scheduleOption={scheduleOption}
              setScheduleOption={setScheduleOption}
              scheduleDateTime={scheduleDateTime}
              setScheduleDateTime={setScheduleDateTime}
              quizSettings={quizSettings}
              selectedSubject={selectedSubject}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-4 lg:px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            {step !== "generating" && (
              <>
                {step !== "select-subject" && step !== "schedule" && (
                  <button
                    onClick={() => {
                      if (step === "configure") setStep("select-materials");
                      else if (
                        step === "select-materials" &&
                        needsSubjectSelection
                      )
                        setStep("select-subject");
                    }}
                    className="px-4 lg:px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step === "select-subject" && canProceedFromSubject)
                      setStep("select-materials");
                    else if (
                      step === "select-materials" &&
                      canProceedFromMaterials
                    )
                      setStep("configure");
                    else if (step === "configure") {
                      handleGenerateQuiz();
                    } else if (step === "schedule") {
                      handleScheduleQuiz();
                    }
                  }}
                  disabled={
                    (step === "select-subject" && !canProceedFromSubject) ||
                    (step === "select-materials" && !canProceedFromMaterials) ||
                    (step === "configure" && isGenerating) ||
                    (step === "schedule" && !canSchedule)
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {step === "select-subject" && "Continue"}
                        {step === "select-materials" && "Continue"}
                        {step === "configure" && "Generate Quiz"}
                        {step === "schedule" &&
                          (scheduleOption === "now"
                            ? "Start Quiz"
                            : "Schedule Quiz")}
                      </span>
                      {step !== "schedule" ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : null}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
