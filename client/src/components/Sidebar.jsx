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
  Building2,
} from "lucide-react";

const items = [
  { to: "/dashboard/jobs", label: "Jobs & Drives", icon: Building2 },
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
    <aside className="resume-no-print w-full rounded-2xl theme-card p-4 lg:w-64">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
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
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700/50"
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
