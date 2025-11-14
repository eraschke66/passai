import React from "react";
import { Book, ChevronDown, CheckCircle2 } from "lucide-react";
import type { Subject } from "../../types/quiz";

interface SubjectFilterDesktopProps {
  subjects: Subject[];
  selectedSubject: Subject;
  setSelectedSubject: (subject: Subject) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SubjectFilterDesktop: React.FC<SubjectFilterDesktopProps> = ({
  subjects,
  selectedSubject,
  setSelectedSubject,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className="hidden lg:block mb-4">
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all bg-${selectedSubject.color}-600 text-white shadow-md hover:shadow-lg`}
        >
          <Book className="w-5 h-5" />
          <span className="font-semibold">{selectedSubject.name}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-xl z-10">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  selectedSubject.id === subject.id ? "bg-blue-50" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-${subject.color}-600 flex items-center justify-center`}
                >
                  <Book className="w-5 h-5 text-white" />
                </div>
                <span className="flex-1 text-left font-semibold text-slate-900">
                  {subject.name}
                </span>
                {selectedSubject.id === subject.id && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
