import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, LogOut, Zap } from "lucide-react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-t-0 border-x-0 h-16 px-6 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-primary-light dark:bg-primary-dark p-2 rounded-xl text-[#082107] shadow-premium">
          <Zap size={20} fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
          Opti
          <span className="text-primary-light dark:text-primary-dark">
            Task
          </span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-400">
              Welcome, {user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      <Navbar />
      <main className="animate-fade-in">{children}</main>
    </div>
  );
};
