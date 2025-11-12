import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./features/auth/context/AuthProvider";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicRoute from "@/features/auth/components/routes/PublicRoute";
import ProtectedRoute from "@/features/auth/components/routes/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import SubjectsPage from "@/features/subjects/pages/SubjectsPage";
import SubjectDetailPage from "@/features/subjects/pages/SubjectDetailPage";
import { MaterialUploadPage } from "@/features/upload/pages/MaterialUploadPage";

// Create a Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            {/* Public Routes - redirect to dashboard if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Password reset can be accessed by anyone with the token */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="/study-plan"
                  element={<div className="p-6">Study Plan (Coming Soon)</div>}
                />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/subjects/:id" element={<SubjectDetailPage />} />
                <Route path="/upload" element={<MaterialUploadPage />} />
                <Route
                  path="/quizzes"
                  element={<div className="p-6">Quizzes (Coming Soon)</div>}
                />
                <Route
                  path="/settings"
                  element={<div className="p-6">Settings (Coming Soon)</div>}
                />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

// There was supposed to be a dropdown where you can select a subject to upload materials for.
// The upload page was supposed to be different page and entirely on it's own from the subject page. It was not supposed to expect a subject it in order to work.
