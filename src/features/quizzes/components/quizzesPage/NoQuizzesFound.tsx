import React from "react";
import { FileQuestion } from "lucide-react";
import type { Subject } from "../../types/quiz";

interface NoQuizzesFoundProps {
  selectedSubject: Subject;
  subjects: Subject[];
  setFilterStatus: (status: "all" | "completed") => void;
  setSelectedSubject: (subject: Subject) => void;
}

export const NoQuizzesFound: React.FC<NoQuizzesFoundProps> = ({
  selectedSubject,
  subjects,
  setFilterStatus,
  setSelectedSubject,
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileQuestion className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        No quizzes found
      </h3>
      <p className="text-slate-600 mb-4">
        {selectedSubject.id !== "all"
          ? `No quizzes for ${selectedSubject.name}`
          : "Try adjusting your filters"}
      </p>
      <button
        onClick={() => {
          setFilterStatus("all");
          setSelectedSubject(subjects[0]);
        }}
        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};
