import React from "react";

interface ScoreCardProps {
  score: number;
  scoreMsg: { title: string; message: string };
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, scoreMsg }) => {
  const getScoreColor = () => {
    if (score >= 90) return "from-emerald-500 to-green-600";
    if (score >= 75) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
      <div className={`p-6 lg:p-8 bg-linear-to-br ${getScoreColor()}`}>
        <div className="text-center text-white">
          <p className="text-sm lg:text-base font-semibold mb-2 text-white/90">
            Your Score
          </p>
          <p className="text-6xl lg:text-7xl font-bold mb-3">{score}%</p>
          <p className="text-xl lg:text-2xl font-bold mb-1">{scoreMsg.title}</p>
          <p className="text-sm lg:text-base text-white/90">
            {scoreMsg.message}
          </p>
        </div>
      </div>
    </div>
  );
};
