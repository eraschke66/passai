import React from "react";
import { CheckCircle2, Play, Calendar, Bell, Zap } from "lucide-react";
import type { QuizSettings, Subject } from "../../types/quiz";

interface ScheduleOptionsProps {
  scheduleOption: "now" | "later";
  setScheduleOption: (option: "now" | "later") => void;
  scheduleDateTime: string;
  setScheduleDateTime: (time: string) => void;
  quizSettings: QuizSettings;
  selectedSubject: Subject | null;
}

export const ScheduleOptions: React.FC<ScheduleOptionsProps> = ({
  scheduleOption,
  setScheduleOption,
  scheduleDateTime,
  setScheduleDateTime,
  quizSettings,
  selectedSubject,
}) => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
          Quiz Generated Successfully! 🎉
        </h3>
        <p className="text-slate-600">
          Your personalized {selectedSubject?.name} quiz with{" "}
          {quizSettings.questionCount} questions is ready
        </p>
      </div>
      <div className="space-y-4 max-w-lg mx-auto">
        <h4 className="text-sm font-bold text-slate-900 mb-3">
          When would you like to take this quiz?
        </h4>
        <button
          onClick={() => setScheduleOption("now")}
          className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
            scheduleOption === "now"
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                scheduleOption === "now" ? "bg-blue-600" : "bg-slate-100"
              }`}
            >
              <Play
                className={`w-6 h-6 ${
                  scheduleOption === "now" ? "text-white" : "text-slate-600"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-slate-900 mb-0.5">Start Now</p>
              <p className="text-sm text-slate-600">
                Begin the quiz immediately
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                scheduleOption === "now"
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              {scheduleOption === "now" && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
        <button
          onClick={() => setScheduleOption("later")}
          className={`w-full p-4 lg:p-5 rounded-xl border-2 transition-all active:scale-[0.98] ${
            scheduleOption === "later"
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                scheduleOption === "later" ? "bg-blue-600" : "bg-slate-100"
              }`}
            >
              <Calendar
                className={`w-6 h-6 ${
                  scheduleOption === "later" ? "text-white" : "text-slate-600"
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-slate-900 mb-0.5">
                Schedule for Later
              </p>
              <p className="text-sm text-slate-600">
                Get a reminder at a specific time
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                scheduleOption === "later"
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }`}
            >
              {scheduleOption === "later" && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </button>
        {scheduleOption === "later" && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl animate-in slide-in-from-top duration-300">
            <label
              htmlFor="schedule-datetime"
              className="block text-sm font-bold text-slate-900 mb-3"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Reminder Date & Time</span>
              </div>
            </label>
            <input
              id="schedule-datetime"
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <p className="text-xs text-blue-700 mt-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              You'll receive a notification when it's time to take your quiz
            </p>
          </div>
        )}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-600 mb-3">QUIZ SUMMARY</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-600 mb-0.5">Subject</p>
              <p className="text-sm font-bold text-slate-900">
                {selectedSubject?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-0.5">Questions</p>
              <p className="text-sm font-bold text-slate-900">
                {quizSettings.questionCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-0.5">Difficulty</p>
              <p className="text-sm font-bold text-slate-900 capitalize">
                {quizSettings.difficulty}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-0.5">Time Limit</p>
              <p className="text-sm font-bold text-slate-900">
                {quizSettings.timeLimit} min
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
