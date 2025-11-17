import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateQuizFlow } from "../components/quizzcreationmodal/CreateQuizFlow";
import { useNavigate } from "react-router-dom";
import { useQuizzes } from "../hooks/useQuizzes";
import { useSubjects } from "../hooks/useSubjects";
import type { Subject } from "../types/quiz";
import { QuizCard } from "../components/quizzesPage/QuizCard";
import { SubjectFilterMobile } from "../components/quizzesPage/SubjectFilterMobile";
import { SubjectFilterDesktop } from "../components/quizzesPage/SubjectFilterDesktop";
import { StatsOverview } from "../components/quizzesPage/StatsOverview";
import { NoQuizzesFound } from "../components/quizzesPage/NoQuizzesFound";

import { useQueryClient } from "@tanstack/react-query";

export const QuizzesPage = () => {
  const queryClient = useQueryClient();

  const { data: rawSubjects = [] } = useSubjects();
  const { data: quizzes = [] } = useQuizzes();

  const allSubject: Subject = {
    id: "all",
    name: "All Subjects",
    // color: "from-slate-600 to-slate-700",
    color: "slate",
  };
  const subjects = [allSubject, ...rawSubjects];

  const [filterStatus, setFilterStatus] = useState<"all" | "completed">("all");
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);

  const navigate = useNavigate();

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesStatus =
      filterStatus === "all" || quiz.status === filterStatus;
    const matchesSubject =
      selectedSubject.id === "all" || quiz.subject_id === selectedSubject.id;
    return matchesStatus && matchesSubject;
  });

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header Section */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 bg-linear-to-br from-slate-50 to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2">
                My Quizzes
              </h1>
              <p className="text-sm lg:text-base text-slate-600">
                Practice and track your performance
              </p>
            </div>
            <button
              onClick={() => setShowCreateQuiz(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Quiz</span>
            </button>
          </div>
          <SubjectFilterMobile
            subjects={subjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
          <SubjectFilterDesktop
            subjects={subjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            isOpen={isSubjectDropdownOpen}
            setIsOpen={setIsSubjectDropdownOpen}
          />
          <StatsOverview
            quizzes={filteredQuizzes}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>
      </div>
      {/* Quizzes List */}
      <div className="px-4 py-4 lg:px-8 lg:py-6">
        <div className="max-w-7xl mx-auto">
          {filteredQuizzes.length === 0 ? (
            <NoQuizzesFound
              selectedSubject={selectedSubject}
              subjects={subjects}
              setFilterStatus={setFilterStatus}
              setSelectedSubject={setSelectedSubject}
            />
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Mobile FAB */}
      <button
        onClick={() => setShowCreateQuiz(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>
      {/* Create Quiz Flow Modal */}
      {showCreateQuiz && (
        <CreateQuizFlow
          onClose={() => setShowCreateQuiz(false)}
          onQuizCreated={(quizId, scheduleTime) => {
            setShowCreateQuiz(false);
            if (!scheduleTime) {
              navigate(`/quizzes/${quizId}`);
            }
            queryClient.invalidateQueries({ queryKey: ["quizzes"] }); // Add this import useQueryClient from '@tanstack/react-query'
          }}
        />
      )}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
