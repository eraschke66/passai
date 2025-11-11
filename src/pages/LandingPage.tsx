import { Link } from "react-router-dom";
import {
  Book,
  Brain,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-2xl shadow-blue-500/30 mb-8">
              <Book className="w-10 h-10 text-white" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
              Turn study materials into
              <br />
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                personalized quizzes
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              PassAI uses AI to transform your notes and textbooks into smart
              practice tests. Know exactly how ready you are for your exam.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-xl hover:bg-white text-slate-900 text-lg font-semibold rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all"
              >
                Log In
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-slate-500">
              Trusted by students preparing for exams worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              AI-Generated Quizzes
            </h3>
            <p className="text-sm text-slate-600">
              Upload your materials and get personalized practice questions
              instantly
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Pass Predictions
            </h3>
            <p className="text-sm text-slate-600">
              Know your chances of passing based on your performance and study
              habits
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Track Progress
            </h3>
            <p className="text-sm text-slate-600">
              Visualize your improvement over time with detailed analytics
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Gamified Learning
            </h3>
            <p className="text-sm text-slate-600">
              Grow your study garden and stay motivated with streaks and rewards
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How PassAI Works
          </h2>
          <p className="text-lg text-slate-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start gap-6">
            <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Upload Your Materials
              </h3>
              <p className="text-slate-600">
                Upload PDFs, images, or text files of your notes, textbooks, or
                study guides
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-6">
            <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Generate Practice Quizzes
              </h3>
              <p className="text-slate-600">
                AI creates personalized questions based on your materials.
                Choose difficulty and question count.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-6">
            <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Track Your Progress
              </h3>
              <p className="text-slate-600">
                Take quizzes, review results, and watch your pass chance
                prediction improve as you study
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-slate-200/60 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">
            Why Students Love PassAI
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Active Learning
                </h4>
                <p className="text-sm text-slate-600">
                  Test yourself instead of passively reading notes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Time Efficient
                </h4>
                <p className="text-sm text-slate-600">
                  Generate quizzes in seconds, not hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Data-Driven
                </h4>
                <p className="text-sm text-slate-600">
                  Make informed decisions with analytics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Stay Motivated
                </h4>
                <p className="text-sm text-slate-600">
                  Gamification keeps studying engaging
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
          Ready to ace your exams?
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Join thousands of students who are studying smarter with PassAI
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all"
        >
          Start Free Today
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/60 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-500">
            <p>&copy; 2025 PassAI. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-slate-700 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
