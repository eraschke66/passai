import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
// import { useAuth } from "../../hooks/useAuth";
import { useAuth } from "../../hooks/useAuth";

/**
 * Public Route Component
 * Redirects to dashboard if user is already authenticated
 * Useful for login/signup pages - authenticated users don't need to see these
 */
export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render public content (login/signup pages)
  return <Outlet />;
}
