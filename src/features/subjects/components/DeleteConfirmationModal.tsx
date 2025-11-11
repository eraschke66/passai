import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import type { Subject } from "@/features/subjects/types";

// =============================================
// Types
// =============================================

interface DeleteConfirmationModalProps {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

// =============================================
// Component
// =============================================

export function DeleteConfirmationModal({
  subject,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState("");

  const isConfirmDisabled = confirmName !== subject.name || isDeleting;

  const handleConfirm = async () => {
    if (confirmName !== subject.name) {
      setError("Subject name does not match");
      return;
    }

    setError("");
    await onConfirm();
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmName("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Close Button */}
          {!isDeleting && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Delete Subject?
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-center mb-6">
            This action <strong>cannot be undone</strong>. This will permanently
            delete <strong className="text-slate-900">{subject.name}</strong>{" "}
            and all associated:
          </p>

          {/* Warning List */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Study materials (PDFs, notes, uploads)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Quiz history and scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Progress tracking data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Study plans and analytics</span>
              </li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label
              htmlFor="confirmName"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Type <strong>{subject.name}</strong> to confirm
            </label>
            <input
              id="confirmName"
              type="text"
              value={confirmName}
              onChange={(e) => {
                setConfirmName(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 rounded-xl border ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              } focus:outline-none focus:ring-4 transition-all`}
              placeholder="Type subject name here..."
              disabled={isDeleting}
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
