import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ResumeContext } from "../context/resumeContext";
import { AuthContext } from "../context/AuthContext";
import { Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const { clearResume } = useContext(ResumeContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const isAdmin = user && user.role === 'administrator';

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDarkMode(isDark);
  }, []);

  const handleLogout = () => {
    logout();
    clearResume();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    setDarkMode(next);
  };

  const studentLinks = [
    { to: "/input/heading", label: "Heading" },
    { to: "/input/experience", label: "Experience" },
    { to: "/input/education", label: "Education" },
    { to: "/input/skills", label: "Skills" },
    { to: "/input/projects", label: "Projects" },
    { to: "/dashboard/profile", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-600/80 dark:bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent" to="/">
          EduVault
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/about" className="rounded-lg px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900">About</Link>
          <Link to="/contact" className="rounded-lg px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900">Contact</Link>
          {isLoggedIn && !isAdmin && studentLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-lg px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900">
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link className="rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" to="/admin/dashboard">
              Admin Dashboard
            </Link>
          )}
          <button type="button" className="rounded-lg border border-slate-300 p-2 text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-900" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isLoggedIn ? (
            <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="rounded-lg px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900" to="/login">Login</Link>
              <Link className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
