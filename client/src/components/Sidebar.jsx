import { NavLink } from "react-router-dom";
import {
  UserCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Trophy,
  Award,
  LayoutPanelTop,
  FileText,
  QrCode,
  MessagesSquare,
} from "lucide-react";

const items = [
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
  { to: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { to: "/dashboard/education", label: "Education", icon: GraduationCap },
  { to: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { to: "/dashboard/certifications", label: "Certifications", icon: Award },
  { to: "/dashboard/portfolio", label: "Portfolio", icon: LayoutPanelTop },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/qr-code", label: "QR Code", icon: QrCode },
  { to: "/dashboard/interview", label: "AI Interview", icon: MessagesSquare },
];

const Sidebar = () => {
  return (
    <aside className="resume-no-print w-full rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 lg:w-64">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        Dashboard
      </p>
      <nav className="space-y-1.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow dark:from-indigo-400 dark:to-violet-400"
                  : "text-slate-800 hover:bg-indigo-50 dark:text-slate-100 dark:hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
