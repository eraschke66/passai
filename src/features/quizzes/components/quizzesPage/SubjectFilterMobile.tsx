import React from "react";
import { Book } from "lucide-react";
import type { Subject } from "../../types/quiz";

interface SubjectFilterMobileProps {
  subjects: Subject[];
  selectedSubject: Subject;
  setSelectedSubject: (subject: Subject) => void;
}

export const SubjectFilterMobile: React.FC<SubjectFilterMobileProps> = ({
  subjects,
  selectedSubject,
  setSelectedSubject,
}) => {
  return (
    <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 pb-1">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject)}
            className={`shrink-0 px-3 py-2 rounded-xl transition-all active:scale-95 ${
              selectedSubject.id === subject.id
                ? `bg-${subject.color}-600 text-white shadow-md`
                : "bg-white border-2 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span className="text-sm font-semibold whitespace-nowrap">
                {subject.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
