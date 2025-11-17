import React from "react";

interface TextAnswerInputProps {
  questionType: "short-answer" | "essay";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TextAnswerInput: React.FC<TextAnswerInputProps> = ({
  questionType,
  value,
  onChange,
  disabled = false,
  placeholder,
}) => {
  const rows = questionType === "essay" ? 8 : 3;
  const defaultPlaceholder =
    questionType === "essay"
      ? "Type your essay answer here... (3-5 paragraphs)"
      : "Type your answer here... (1-3 sentences)";

  return (
    <div className="mb-6">
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        disabled={disabled}
        placeholder={placeholder || defaultPlaceholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all resize-none ${
          disabled
            ? "bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed"
            : "bg-white border-slate-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-slate-500">
          {questionType === "essay"
            ? "💡 Write clearly and organize your thoughts"
            : "💡 Be specific and concise"}
        </p>
        <p className="text-xs text-slate-400">
          {value.length} character{value.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};
