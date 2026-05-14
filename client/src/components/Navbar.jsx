import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const navLink = "block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition";
const mobileNavLink = "block px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition";
const dropdownBtn = "flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition";
const dropdownItem = "block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition";

function Navbar() {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const role = user?.role;
  const isAdmin = role === 'administrator';
  const isStudent = role === 'student';
  const isMentor = role === 'mentor';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const Dropdown = ({ name, label, items }) => (
    <div className="relative">
      <button onClick={() => toggleDropdown(name)} className={dropdownBtn}>
        {label}
        <svg className={`w-4 h-4 transition ${openDropdown === name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openDropdown === name && (
        <div className="absolute left-0 mt-1 w-48 rounded-xl border border-gray-700 bg-gray-900 py-2 shadow-lg z-50">
          {items.map((item) => (
            <Link key={item.to} to={item.to} onClick={closeMenu} className={dropdownItem}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const MobileDropdown = ({ name, label, items }) => (
    <div>
      <button onClick={() => toggleDropdown(name)} className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">
        {label}
        <svg className={`w-4 h-4 transition ${openDropdown === name ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openDropdown === name && (
        <div className="ml-4 mt-1 space-y-1">
          {items.map((item) => (
            <Link key={item.to} to={item.to} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-800 hover:text-white transition">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="theme-gradient-text text-lg font-bold shrink-0" onClick={closeMenu}>
            EduVault
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {isStudent && (
              <>
                <Dropdown name="dashboard" label="Dashboard" items={[
                  { to: "/dashboard/jobs", label: "Jobs & Drives" },
                  { to: "/dashboard/profile", label: "Profile" },
                  { to: "/dashboard/education", label: "Education" },
                  { to: "/dashboard/experience", label: "Experience" },
                  { to: "/dashboard/skills", label: "Skills" },
                  { to: "/dashboard/projects", label: "Projects" },
                  { to: "/dashboard/achievements", label: "Achievements" },
                  { to: "/dashboard/certifications", label: "Certifications" },
                ]} />
                <Dropdown name="portfolio" label="Portfolio" items={[
                  { to: "/portfolio/layout-s", label: "Layout S" },
                  { to: "/portfolio/layout-k", label: "Layout K" },
                  { to: "/portfolio/layout-t", label: "Layout T" },
                ]} />
                <Link to="/portfolio" className={navLink}>Portfolio Page</Link>
                <Link to="/resume" className={navLink}>Resume</Link>
                <Link to="/qr-code" className={navLink}>QR Code</Link>
              </>
            )}

            {isStudent && (
              <Link to="/interview/domain" className={`${navLink} text-cyan-400 hover:text-cyan-300`}>
                Mock Interview
              </Link>
            )}
            {isMentor && (
              <Link to="/mentor-dashboard" className={`${navLink} text-amber-400 hover:text-amber-300`}>
                Mentor Dashboard
              </Link>
            )}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {isAdmin && (
              <Dropdown name="admin" label={<span className="text-emerald-400">Admin</span>} items={[
                { to: "/admin/dashboard", label: "Dashboard" },
                { to: "/admin/drives", label: "Drives" },
                { to: "/admin/applications", label: "Applications" },
                { to: "/admin/users", label: "Users" },
                { to: "/admin/analytics", label: "Analytics" },
              ]} />
            )}
            {isLoggedIn && <NotificationBell />}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={navLink}>Login</Link>
                <Link to="/signup" className="rounded-lg theme-btn-primary px-4 py-2 text-sm font-medium text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-700/50 px-4 pb-4 pt-2 space-y-1 bg-gray-900/95 backdrop-blur-md">

          {isStudent && (
            <>
              <MobileDropdown name="m-dashboard" label="Dashboard" items={[
                { to: "/dashboard/jobs", label: "Jobs & Drives" },
                { to: "/dashboard/profile", label: "Profile" },
                { to: "/dashboard/education", label: "Education" },
                { to: "/dashboard/experience", label: "Experience" },
                { to: "/dashboard/skills", label: "Skills" },
                { to: "/dashboard/projects", label: "Projects" },
                { to: "/dashboard/achievements", label: "Achievements" },
                { to: "/dashboard/certifications", label: "Certifications" },
              ]} />
              <MobileDropdown name="m-portfolio" label="Portfolio Layouts" items={[
                { to: "/portfolio/layout-s", label: "Layout S" },
                { to: "/portfolio/layout-k", label: "Layout K" },
                { to: "/portfolio/layout-t", label: "Layout T" },
              ]} />
              <Link to="/portfolio" onClick={closeMenu} className={mobileNavLink}>Portfolio Page</Link>
              <Link to="/resume" onClick={closeMenu} className={mobileNavLink}>Resume</Link>
              <Link to="/qr-code" onClick={closeMenu} className={mobileNavLink}>QR Code</Link>
            </>
          )}

          {isStudent && (
            <Link to="/interview/domain" onClick={closeMenu} className={`${mobileNavLink} text-cyan-400`}>
              Mock Interview
            </Link>
          )}

          {isMentor && (
            <Link to="/mentor-dashboard" onClick={closeMenu} className={`${mobileNavLink} text-amber-400`}>
              Mentor Dashboard
            </Link>
          )}

          <hr className="border-gray-700/50" />

          {isAdmin && (
            <MobileDropdown name="m-admin" label={<span className="text-emerald-400">Admin</span>} items={[
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/drives", label: "Drives" },
              { to: "/admin/applications", label: "Applications" },
              { to: "/admin/users", label: "Users" },
              { to: "/admin/analytics", label: "Analytics" },
            ]} />
          )}

          {isLoggedIn ? (
            <>
              <div className="px-3 py-2"><NotificationBell /></div>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={mobileNavLink}>Login</Link>
              <Link to="/signup" onClick={closeMenu} className="block rounded-lg theme-btn-primary px-3 py-2 text-sm font-medium text-white text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
