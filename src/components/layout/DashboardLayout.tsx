import {
  Settings,
  Bell,
  LayoutDashboard,
  Upload,
  FileQuestion,
  GraduationCap,
  LogOut,
  Book,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signOut } from "@/features/auth/services/authService";
import { Logo } from "@/components/ui/Logo";

/*----------------------------------------------*/

// import * as Sentry from '@sentry/react';

function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
    >
      Break the world
    </button>
  );
}

/*----------------------------------------------*/



type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
};

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "study-plan",
    label: "Study Plan",
    icon: GraduationCap,
    path: "/study-plan",
  },
  {
    id: "subjects",
    label: "Subjects",
    icon: Book,
    path: "/subjects",
  },
  {
    id: "upload",
    label: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: FileQuestion,
    path: "/quizzes",
  },
];

export default function DashboardLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="flex flex-col h-screen lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200/60">
            <Logo size={48} showText={true} />
          </div>

          <nav
            className="flex-1 overflow-y-auto p-4"
            aria-label="Main navigation"
          >
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                Navigation
              </h3>
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive(item.path)
                            ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                        aria-current={isActive(item.path) ? "page" : undefined}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left font-semibold text-sm">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              isActive(item.path)
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
                <ErrorButton />  {/* Sentry Test */}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200/60 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-all">
              <Bell className="w-5 h-5" />
              <span className="text-sm font-semibold">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive("/settings")
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-semibold">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-semibold">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm safe-top">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity active:scale-95"
              >
                <Logo size={40} />
                <div>
                  <h1 className="text-base font-bold text-slate-900">PassAI</h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Hi, {profile?.first_name || "Student"}!
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all relative">
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all"
                >
                  <Settings className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 pt-16 lg:pt-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-lg safe-bottom"
          aria-label="Mobile navigation"
        >
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                  }}
                  className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl transition-all active:scale-95 ${
                    isActive(item.path) ? "text-blue-600" : "text-slate-500"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive(item.path) ? "scale-110" : ""
                      } transition-transform`}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isActive(item.path) ? "text-blue-600" : "text-slate-500"
                    }`}
                  >
                    {item.label.split(" ")[0]}
                  </span>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <style>{`
                .safe-top { padding-top: env(safe-area-inset-top); }
                .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
                @supports (backdrop-filter: blur(10px)) {
                  .backdrop-blur-xl { backdrop-filter: blur(20px); }
                }
              `}</style>
    </div>
  );
}
