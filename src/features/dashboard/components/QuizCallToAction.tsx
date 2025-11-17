import { Brain, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuizCallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-8 shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <Brain className="w-10 h-10 text-white" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="text-2xl font-bold text-white">
              Ready to test your knowledge?
            </h3>
          </div>
          <p className="text-blue-100 text-sm md:text-base">
            Take a quiz to identify your weak areas and track your progress with
            AI-powered insights
          </p>
        </div>

        <button
          onClick={() => navigate("/quizzes")}
          className="shrink-0 px-8 py-4 bg-white hover:bg-slate-50 text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          Start a Quiz
        </button>
      </div>
    </div>
  );
};
