import React from "react";
import type { Quiz } from "../../types/quiz";

interface StatsOverviewProps {
  quizzes: Quiz[];
  filterStatus: "all" | "completed";
  setFilterStatus: (status: "all" | "completed") => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  quizzes,
  filterStatus,
  setFilterStatus,
}) => {
  const stats = {
    total: quizzes.length,
    completed: quizzes.filter((q) => q.status === "completed").length,
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
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
      <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl p-3 lg:p-4 text-white col-span-2 lg:col-span-1">
        <p className="text-xs lg:text-sm font-medium mb-1 text-white/90">
          Avg Score
        </p>
        <p className="text-xl lg:text-3xl font-bold">{stats.averageScore}%</p>
      </div>
    </div>
  );
};
