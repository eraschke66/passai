import React from "react";
import type { Quiz } from "../../types/quiz";

interface StatsOverviewProps {
  quizzes: Quiz[];
  filterStatus: "all" | "completed" | "in-progress" | "not-started";
  setFilterStatus: (
    status: "all" | "completed" | "in-progress" | "not-started"
  ) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  quizzes,
  filterStatus,
  setFilterStatus,
}) => {
  const stats = {
    total: quizzes.length,
    completed: quizzes.filter((q) => q.status === "completed").length,
    inProgress: quizzes.filter((q) => q.status === "in-progress").length,
    notStarted: quizzes.filter((q) => q.status === "not-started").length,
    averageScore:
      quizzes.filter((q) => q.score !== undefined).length > 0
        ? Math.round(
            quizzes
              .filter((q) => q.score !== undefined)
              .reduce((acc, q) => acc + (q.score || 0), 0) /
              quizzes.filter((q) => q.score !== undefined).length
          )
        : 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
      <button
        onClick={() => setFilterStatus("all")}
        className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${
          filterStatus === "all"
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-slate-200"
        }`}
      >
        <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">
          Total
        </p>
        <p className="text-xl lg:text-3xl font-bold text-slate-900">
          {stats.total}
        </p>
      </button>
      <button
        onClick={() => setFilterStatus("completed")}
        className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${
          filterStatus === "completed"
            ? "border-emerald-500 ring-2 ring-emerald-100"
            : "border-slate-200"
        }`}
      >
        <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">
          Done
        </p>
        <p className="text-xl lg:text-3xl font-bold text-emerald-600">
          {stats.completed}
        </p>
      </button>
      <button
        onClick={() => setFilterStatus("in-progress")}
        className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${
          filterStatus === "in-progress"
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-slate-200"
        }`}
      >
        <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">
          Active
        </p>
        <p className="text-xl lg:text-3xl font-bold text-blue-600">
          {stats.inProgress}
        </p>
      </button>
      <button
        onClick={() => setFilterStatus("not-started")}
        className={`bg-white rounded-xl p-3 lg:p-4 border-2 transition-all active:scale-95 ${
          filterStatus === "not-started"
            ? "border-slate-500 ring-2 ring-slate-100"
            : "border-slate-200"
        }`}
      >
        <p className="text-xs lg:text-sm text-slate-600 font-medium mb-1">
          Pending
        </p>
        <p className="text-xl lg:text-3xl font-bold text-slate-900">
          {stats.notStarted}
        </p>
      </button>
      <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl p-3 lg:p-4 text-white col-span-2 lg:col-span-1">
        <p className="text-xs lg:text-sm font-medium mb-1 text-white/90">
          Avg Score
        </p>
        <p className="text-xl lg:text-3xl font-bold">{stats.averageScore}%</p>
      </div>
    </div>
  );
};
