import { ArrowRight, BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { useRef } from "react";

export const SubjectsCarousel = () => {
  const navigate = useNavigate();
  const { data: subjects, isLoading } = useSubjects();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-slate-200 rounded mb-4"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-64 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 shadow-lg">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No subjects yet
          </h3>
          <p className="text-slate-600 mb-6">
            Create your first subject to start generating quizzes, uploading
            materials, and tracking your progress.
          </p>
          <button
            onClick={() => navigate("/subjects")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Subject
          </button>
        </div>
      </div>
    );
  }

  const displaySubjects = subjects.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Your Subjects
        </h2>
        {subjects.length > 5 && (
          <button
            onClick={() => navigate("/subjects")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            See all {subjects.length}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
      >
        {displaySubjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => navigate(`/subjects/${subject.id}`)}
            className="shrink-0 w-72 bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200/60 shadow-lg hover:shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  {subject.exam_board || "General"}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                <span className="text-xl">{subject.icon || "📚"}</span>
              </div>
            </div>

            {subject.pass_chance !== null &&
              subject.pass_chance !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">
                      Pass Probability
                    </span>
                    <span className="font-bold text-slate-900">
                      {subject.pass_chance}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        subject.pass_chance >= 70
                          ? "bg-linear-to-r from-emerald-500 to-green-500"
                          : subject.pass_chance >= 50
                          ? "bg-linear-to-r from-amber-500 to-orange-500"
                          : "bg-linear-to-r from-red-500 to-rose-500"
                      }`}
                      style={{ width: `${subject.pass_chance}%` }}
                    />
                  </div>
                </div>
              )}

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{subject.question_style || "Multiple Choice"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {subjects.length <= 5 && subjects.length > 0 && (
        <button
          onClick={() => navigate("/subjects")}
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-600 hover:text-blue-600 font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Subject
        </button>
      )}
    </div>
  );
};
