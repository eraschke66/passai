import React from "react";
import { X, FileText } from "lucide-react";
import type { Question } from "../../types/quiz";

interface SourceModalProps {
  currentQuestion: Question;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  currentQuestion,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 md:hidden"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900">Source Snippet</h3>
                <p className="text-xs text-slate-600">
                  Where in the materials this question is sourced from
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {currentQuestion.source_snippet}
          </p>
        </div>
      </div>
    </div>
  );
};
