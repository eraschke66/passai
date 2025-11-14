import React from "react";
import {
  Edit3,
  Target,
  Settings,
  Hash,
  Timer,
  TrendingUp,
  Brain,
  ChevronDown,
  Check,
} from "lucide-react";
import type { QuizSettings, CognitiveMix, Subject } from "../../types/quiz";

interface QuizConfigurationProps {
  quizSettings: QuizSettings;
  setQuizSettings: (settings: QuizSettings) => void;
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (show: boolean) => void;
  selectedSubject: Subject | null;
  selectedMaterials: string[];
}

export const QuizConfiguration: React.FC<QuizConfigurationProps> = ({
  quizSettings,
  setQuizSettings,
  showAdvancedOptions,
  setShowAdvancedOptions,
  selectedSubject,
  selectedMaterials,
}) => {
  const updateCognitiveMix = (key: keyof CognitiveMix, value: number) => {
    const newMix = { ...quizSettings.cognitiveMix, [key]: value };
    const sum = newMix.recall + newMix.understanding + newMix.application;
    if (sum > 100) {
      // Normalize or adjust, but per code, recalculate remaining
      const remaining = 100 - value;
      const otherKeys = Object.keys(newMix).filter(
        (k) => k !== key
      ) as (keyof CognitiveMix)[];
      const ratio1 =
        quizSettings.cognitiveMix[otherKeys[0]] /
        (quizSettings.cognitiveMix[otherKeys[0]] +
          quizSettings.cognitiveMix[otherKeys[1]]);
      newMix[otherKeys[0]] = Math.round(remaining * ratio1);
      newMix[otherKeys[1]] = Math.round(remaining * (1 - ratio1));
    }
    setQuizSettings({ ...quizSettings, cognitiveMix: newMix });
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-3 mb-2">
          {selectedSubject && (
            <div
              className={`px-3 py-1.5 rounded-lg bg-${selectedSubject.color}-600 text-white text-sm font-semibold`}
            >
              {selectedSubject.name}
            </div>
          )}
          <span className="text-xs text-slate-600">
            {selectedMaterials.length} material
            {selectedMaterials.length !== 1 ? "s" : ""}
          </span>
        </div>
        <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
          Configure Quiz Details
        </h3>
        <p className="text-sm text-slate-600">
          Customize your quiz or use AI-generated defaults
        </p>
      </div>
      <div className="space-y-5 lg:space-y-6">
        <div>
          <label
            htmlFor="quiz-title"
            className="block text-sm font-bold text-slate-900 mb-3"
          >
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Quiz Title</span>
              <span className="text-slate-400 font-normal text-xs">
                (Optional - AI will generate if left blank)
              </span>
            </div>
          </label>
          <input
            id="quiz-title"
            type="text"
            value={quizSettings.customTitle}
            onChange={(e) =>
              setQuizSettings({ ...quizSettings, customTitle: e.target.value })
            }
            placeholder="e.g., World War II Analysis Quiz"
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="focus-areas"
            className="block text-sm font-bold text-slate-900 mb-3"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-600" />
              <span>Focus Areas or Notes</span>
              <span className="text-slate-400 font-normal text-xs">
                (Optional)
              </span>
            </div>
          </label>
          <textarea
            id="focus-areas"
            value={quizSettings.focusAreas}
            onChange={(e) =>
              setQuizSettings({ ...quizSettings, focusAreas: e.target.value })
            }
            placeholder="e.g., Focus more on World War II battles, include questions about key dates and locations, emphasize cause and effect relationships..."
            rows={4}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          />
          <p className="text-xs text-slate-500 mt-2">
            Tell the AI what topics or areas you'd like emphasized in the quiz
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl transition-all"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <div className="text-left">
                <p className="font-bold text-slate-900">Advanced Options</p>
                <p className="text-xs text-slate-600">
                  {quizSettings.questionCount} questions •{" "}
                  {quizSettings.difficulty} • {quizSettings.timeLimit} min
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-600 transition-transform ${
                showAdvancedOptions ? "rotate-180" : ""
              }`}
            />
          </button>
          {showAdvancedOptions && (
            <div className="mt-4 p-4 lg:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-5 animate-in slide-in-from-top duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-600" />
                    <span>Number of Questions</span>
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={quizSettings.questionCount}
                    onChange={(e) =>
                      setQuizSettings({
                        ...quizSettings,
                        questionCount: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-2xl font-bold text-blue-600 w-12 text-right">
                    {quizSettings.questionCount}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-600" />
                    <span>Difficulty Level</span>
                  </div>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {(["easy", "medium", "hard", "adaptive"] as const).map(
                    (level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setQuizSettings({
                            ...quizSettings,
                            difficulty: level,
                          })
                        }
                        className={`p-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all active:scale-95 ${
                          quizSettings.difficulty === level
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {level}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-slate-600" />
                    <span>Time Limit (minutes)</span>
                  </div>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[15, 20, 30, 45, 60].map((time) => (
                    <button
                      key={time}
                      onClick={() =>
                        setQuizSettings({ ...quizSettings, timeLimit: time })
                      }
                      className={`p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                        quizSettings.timeLimit === time
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Question Types
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(quizSettings.questionTypes).map(
                    ([type, enabled]) => (
                      <button
                        key={type}
                        onClick={() =>
                          setQuizSettings({
                            ...quizSettings,
                            questionTypes: {
                              ...quizSettings.questionTypes,
                              [type]: !enabled,
                            },
                          })
                        }
                        className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 ${
                          enabled
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              enabled
                                ? "bg-emerald-600 border-emerald-600"
                                : "bg-white border-slate-300"
                            }`}
                          >
                            {enabled && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="capitalize">
                            {type.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-slate-600" />
                    <span>Cognitive Mix</span>
                  </div>
                </label>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Recall
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {quizSettings.cognitiveMix.recall}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={quizSettings.cognitiveMix.recall}
                      onChange={(e) =>
                        updateCognitiveMix("recall", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Basic facts and definitions
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Understanding
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {quizSettings.cognitiveMix.understanding}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={quizSettings.cognitiveMix.understanding}
                      onChange={(e) =>
                        updateCognitiveMix(
                          "understanding",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Concepts and explanations
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Application
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {quizSettings.cognitiveMix.application}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={quizSettings.cognitiveMix.application}
                      onChange={(e) =>
                        updateCognitiveMix(
                          "application",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Problem-solving and analysis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
