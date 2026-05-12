import { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

// Admin
import AdminDashboardPage from "./pages/AdminDashboardPage";
import JobDescriptionFormPage from "./pages/JobDescriptionFormPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import AdminRoute from "./components/AdminRoute";
import MatchResultsPage from "./pages/MatchResultsPage";

// Forms
import HeadingForm from "./components/Resume/Forms/HeadingForm";
import ExperienceForm from "./components/Resume/Forms/ExperienceForm";
import EducationForm from "./components/Resume/Forms/EducationForm";
import SkillsForm from "./components/Resume/Forms/SkillsForm";
import ProjectsForm from "./components/Resume/Forms/ProjectsForm";
import CertificationsForm from "./components/Resume/Forms/CertificationsForm";
import AchievementsForm from "./components/Resume/Forms/AchievementsForm";

// Display
import Heading from "./components/Resume/Heading";
import Experience from "./components/Resume/Experience";
import Education from "./components/Resume/Education";
import Skills from "./components/Resume/Skills";
import Projects from "./components/Resume/Projects";
import Certifications from "./components/Resume/Certifications";
import Achievements from "./components/Resume/Achievements";

// Auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Portfolio layouts
import LayoutS from "./components/Portfolio/Layouts/LayoutS/LayoutS";
import LayoutK from "./components/Portfolio/Layouts/LayoutK/LayoutK";
import LayoutT from "./components/Portfolio/Layouts/LayoutT/LayoutT";

// Interview
import StudentRoute from "./components/StudentRoute";
import DomainSelection from "./pages/interview/DomainSelection";
import MockInterview from "./pages/interview/MockInterview";
import InterviewResult from "./pages/interview/InterviewResult";

// Mentor
import CVTemplate from "./components/Resume/CVTemplate";
import FacultyMentoringDashboard from "./components/FacultyMentoringDashboard";
import MentorDashboard from "./pages/MentorDashboard";

// New pages from restructuring
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./pages/ProfilePage";
import EducationPage from "./pages/EducationPage";
import ExperiencePage from "./pages/ExperiencePage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import AchievementsPage from "./pages/AchievementsPage";
import CertificationsPage from "./pages/CertificationsPage";
import PortfolioPage from "./pages/PortfolioPage";
import ResumePage from "./pages/ResumePage";
import QrCodePage from "./pages/QrCodePage";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";

const RoleRoute = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const { user: authUser } = useContext(AuthContext);
  const location = useLocation();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const activeUser = authUser || user;

  const isPublicPortfolio = location.pathname.startsWith("/share/portfolio/");

  return (
    <>
      {!isPublicPortfolio && <Navbar />}

      <main className={isPublicPortfolio ? "" : "p-3"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/share/portfolio/:userId" element={<PublicPortfolioPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* Student Dashboard */}
          <Route path="/dashboard" element={<RoleRoute allowedRoles={['student']}><DashboardLayout /></RoleRoute>}>
            <Route index element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="qr-code" element={<QrCodePage />} />
            <Route path="interview" element={<Navigate to="/interview/domain" replace />} />
          </Route>

          {/* Student standalone pages */}
          <Route path="/portfolio" element={<RoleRoute allowedRoles={['student']}><PortfolioPage /></RoleRoute>} />
          <Route path="/resume" element={<RoleRoute allowedRoles={['student']}><ResumePage /></RoleRoute>} />
          <Route path="/qr-code" element={<RoleRoute allowedRoles={['student']}><QrCodePage /></RoleRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/job-descriptions/new" element={<AdminRoute><JobDescriptionFormPage /></AdminRoute>} />
          <Route path="/admin/job-descriptions/edit/:id" element={<AdminRoute><JobDescriptionFormPage /></AdminRoute>} />
          <Route path="/admin/job-descriptions/:id/matches" element={<AdminRoute><MatchResultsPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><UserDetailPage /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
          <Route path="/admin/job-descriptions/:jobId/applications" element={<AdminRoute><JobApplicationsPage /></AdminRoute>} />

          {/* Mentor Routes */}
          <Route path="/faculty-dashboard" element={<RoleRoute allowedRoles={['administrator', 'mentor']}><FacultyMentoringDashboard /></RoleRoute>} />
          <Route path="/mentor-dashboard" element={<RoleRoute allowedRoles={['administrator', 'mentor']}><MentorDashboard /></RoleRoute>} />

          {/* Input Routes */}
          <Route path="/input/heading" element={<RoleRoute allowedRoles={['student']}><HeadingForm /></RoleRoute>} />
          <Route path="/input/experience" element={<RoleRoute allowedRoles={['student']}><ExperienceForm /></RoleRoute>} />
          <Route path="/input/education" element={<RoleRoute allowedRoles={['student']}><EducationForm /></RoleRoute>} />
          <Route path="/input/skills" element={<RoleRoute allowedRoles={['student']}><Skills isInput={true} /></RoleRoute>} />
          <Route path="/input/projects" element={<RoleRoute allowedRoles={['student']}><ProjectsForm /></RoleRoute>} />
          <Route path="/input/certifications" element={<RoleRoute allowedRoles={['student']}><CertificationsForm /></RoleRoute>} />
          <Route path="/input/achievements" element={<RoleRoute allowedRoles={['student']}><AchievementsForm /></RoleRoute>} />

          {/* Output Routes */}
          <Route path="/output/heading" element={<RoleRoute allowedRoles={['student']}><Heading /></RoleRoute>} />
          <Route path="/output/experience" element={<RoleRoute allowedRoles={['student']}><Experience /></RoleRoute>} />
          <Route path="/output/education" element={<RoleRoute allowedRoles={['student']}><Education /></RoleRoute>} />
          <Route path="/output/skills" element={<RoleRoute allowedRoles={['student']}><Skills isInput={false} /></RoleRoute>} />
          <Route path="/output/projects" element={<RoleRoute allowedRoles={['student']}><Projects /></RoleRoute>} />
          <Route path="/output/certifications" element={<RoleRoute allowedRoles={['student']}><Certifications /></RoleRoute>} />
          <Route path="/output/achievements" element={<RoleRoute allowedRoles={['student']}><Achievements /></RoleRoute>} />

          {/* Portfolio Layouts */}
          <Route path="/portfolio/layout-s" element={<RoleRoute allowedRoles={['student']}><LayoutS /></RoleRoute>} />
          <Route path="/portfolio/layout-k" element={<RoleRoute allowedRoles={['student']}><LayoutK /></RoleRoute>} />
          <Route path="/portfolio/layout-t" element={<RoleRoute allowedRoles={['student']}><LayoutT /></RoleRoute>} />

          {/* Interview */}
          <Route path="/interview/domain" element={<StudentRoute><DomainSelection /></StudentRoute>} />
          <Route path="/interview/session/:domainSlug" element={<StudentRoute><MockInterview /></StudentRoute>} />
          <Route path="/interview/result/:id" element={<StudentRoute><InterviewResult /></StudentRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;

