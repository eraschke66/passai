import React from "react";
import {
  BookOpen,
  Upload,
  Brain,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const WelcomeStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome to PassAI! 🎉
        </h3>
        <p className="text-slate-600 max-w-lg mx-auto">
          Your AI-powered study companion that helps you master any subject with
          personalized quizzes and intelligent learning insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Add Subjects</h4>
          <p className="text-sm text-slate-600">
            Start by adding the subjects you're studying
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Upload Materials</h4>
          <p className="text-sm text-slate-600">
            Upload your study notes, PDFs, or textbooks
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">
            AI-Generated Quizzes
          </h4>
          <p className="text-sm text-slate-600">
            Get personalized quizzes tailored to your curriculum
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 mb-1">Track Progress</h4>
          <p className="text-sm text-slate-600">
            Monitor your improvement and master every topic
          </p>
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
        <p className="text-sm text-slate-700 text-center">
          ⚡ <strong>Pro tip:</strong> The more you practice, the smarter our AI
          gets at identifying your weak areas and creating targeted quizzes!
        </p>
      </div>
    </div>
  );
};

export const SubjectsStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Add Your Subjects</h3>
          <p className="text-sm text-slate-600">
            Start by adding the subjects you're currently studying. Each subject
            can have its own curriculum, exam board, and study materials.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Choose Your Subject
            </h4>
            <p className="text-sm text-slate-600">
              Select from common subjects like Mathematics, Physics, Chemistry,
              or create a custom one.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Select Exam Board
            </h4>
            <p className="text-sm text-slate-600">
              Pick your curriculum (e.g., Cambridge IGCSE, IB, AP) so we can
              align quizzes with your syllabus.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Set Your Goal</h4>
            <p className="text-sm text-slate-600">
              Choose your target grade to help our AI personalize your learning
              experience.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm text-slate-700">
          💡 <strong>Tip:</strong> You can add multiple subjects and switch
          between them anytime from your dashboard!
        </p>
      </div>
    </div>
  );
};

export const MaterialsStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">
            Upload Study Materials
          </h3>
          <p className="text-sm text-slate-600">
            Upload your notes, textbooks, or PDFs. Our AI will analyze them to
            create personalized quizzes based on your actual study content.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-slate-600">PDF</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                Supported Formats
              </p>
              <p className="text-xs text-slate-600">PDF, DOCX, TXT, and more</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Maximum file size: 10MB per file
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">AI Analysis</h4>
            <p className="text-sm text-slate-600">
              Our AI reads your materials and identifies key concepts, topics,
              and learning objectives.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Smart Quizzes</h4>
            <p className="text-sm text-slate-600">
              Quizzes are generated directly from your uploaded content,
              ensuring they're relevant to what you're actually studying.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-slate-700">
          🔒 <strong>Privacy:</strong> Your materials are securely stored and
          only used to generate your personalized quizzes.
        </p>
      </div>
    </div>
  );
};

export const QuizzesStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Take AI Quizzes</h3>
          <p className="text-sm text-slate-600">
            Practice with AI-generated quizzes that adapt to your learning style
            and focus on your weak areas.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Multiple Choice
                </p>
                <p className="text-xs text-slate-600">Quick knowledge checks</p>
              </div>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              AI Graded
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Short Answer
                </p>
                <p className="text-xs text-slate-600">Test understanding</p>
              </div>
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
              AI Graded
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Essay</p>
                <p className="text-xs text-slate-600">Deep analysis</p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              AI Graded
            </span>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
        <p className="text-sm text-slate-700">
          ✨ <strong>Smart Feedback:</strong> Get instant AI-powered feedback
          that tells you exactly what you got right and what to improve!
        </p>
      </div>
    </div>
  );
};

export const ProgressStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-1">Track Your Progress</h3>
          <p className="text-sm text-slate-600">
            Monitor your improvement with detailed analytics and intelligent
            insights about your learning journey.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Pass Probability
            </h4>
            <p className="text-sm text-slate-600">
              See your predicted chance of passing each subject based on your
              quiz performance.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Garden Health</h4>
            <p className="text-sm text-slate-600">
              Watch your knowledge garden grow as you master topics and improve
              your scores.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">
              Smart Insights
            </h4>
            <p className="text-sm text-slate-600">
              Get personalized recommendations on which subjects need more
              attention and when to take your next quiz.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-bold mb-2">You're All Set!</h4>
        <p className="text-sm text-blue-100">
          Ready to start your learning journey? Let's add your first subject and
          begin mastering your exams! 🚀
        </p>
      </div>
    </div>
  );
};
