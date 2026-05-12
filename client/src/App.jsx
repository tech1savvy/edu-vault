import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar";
import MatchResultsPage from "./pages/MatchResultsPage";

// Admin Components
import AdminDashboardPage from "./pages/AdminDashboardPage";
import JobDescriptionFormPage from "./pages/JobDescriptionFormPage";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Form Components
import HeadingForm from "./components/Resume/Forms/HeadingForm";
import ExperienceForm from "./components/Resume/Forms/ExperienceForm";
import EducationForm from "./components/Resume/Forms/EducationForm";
import ProjectsForm from "./components/Resume/Forms/ProjectsForm";
import CertificationsForm from "./components/Resume/Forms/CertificationsForm";
import AchievementsForm from "./components/Resume/Forms/AchievementsForm";

// Display Components
import Heading from "./components/Resume/Heading";
import Experience from "./components/Resume/Experience";
import Education from "./components/Resume/Education";
import Skills from "./components/Resume/Skills";
import Projects from "./components/Resume/Projects";
import Certifications from "./components/Resume/Certifications";
import Achievements from "./components/Resume/Achievements";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LayoutK from "./components/Portfolio/Layouts/LayoutK/LayoutK";
import LayoutT from "./components/Portfolio/Layouts/LayoutT/LayoutT";
import { ResumeContext } from "./context/resumeContext";
import { AuthContext } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProfilePage from "./pages/ProfilePage";
import EducationPage from "./pages/EducationPage";
import ProjectsPage from "./pages/ProjectsPage";
import AchievementsPage from "./pages/AchievementsPage";
import CertificationsPage from "./pages/CertificationsPage";
import PortfolioPage from "./pages/PortfolioPage";
import ResumePage from "./pages/ResumePage";
import QrCodePage from "./pages/QrCodePage";
import ExperiencePage from "./pages/ExperiencePage";
import SkillsPage from "./pages/SkillsPage";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";

// Interview Pages
import DomainSelection from "./pages/interview/DomainSelection";
import MockInterview from "./pages/interview/MockInterview";
import InterviewResult from "./pages/interview/InterviewResult";

function AppContent() {
  const { refreshResume } = useContext(ResumeContext);
  const { user, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const isPublicPortfolio = location.pathname.startsWith("/share/portfolio/");

  useEffect(() => {
    if (isLoggedIn && user && user.role === 'student') {
      refreshResume();
    }
  }, [isLoggedIn, user, refreshResume]);

  return (
    <>
      {!isPublicPortfolio && <Navbar />}
      <main className={isPublicPortfolio ? "" : "p-3"}>
        <Routes>
          <Route path="/share/portfolio/:userId" element={<PublicPortfolioPage />} />
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/job-descriptions/new"
            element={
              <AdminRoute>
                <JobDescriptionFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/job-descriptions/edit/:id"
            element={
              <AdminRoute>
                <JobDescriptionFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/job-descriptions/:id/matches"
            element={
              <AdminRoute>
                <MatchResultsPage />
              </AdminRoute>
            }
          />

          {/* Input Routes */}
          <Route path="/input/heading" element={<ProtectedRoute><HeadingForm /></ProtectedRoute>} />
          <Route path="/input/experience" element={<ProtectedRoute><ExperienceForm /></ProtectedRoute>} />
          <Route path="/input/education" element={<ProtectedRoute><EducationForm /></ProtectedRoute>} />
          <Route path="/input/skills" element={<ProtectedRoute><Skills isInput={true} /></ProtectedRoute>} />
          <Route path="/input/projects" element={<ProtectedRoute><ProjectsForm /></ProtectedRoute>} />
          <Route
            path="/input/certifications"
            element={<ProtectedRoute><CertificationsForm /></ProtectedRoute>}
          />
          <Route path="/input/achievements" element={<ProtectedRoute><AchievementsForm /></ProtectedRoute>} />

          {/* Output Routes */}
          <Route path="/output/heading" element={<ProtectedRoute><Heading /></ProtectedRoute>} />
          <Route path="/output/experience" element={<ProtectedRoute><Experience /></ProtectedRoute>} />
          <Route path="/output/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
          <Route path="/output/skills" element={<ProtectedRoute><Skills isInput={false} /></ProtectedRoute>} />
          <Route path="/output/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/output/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          <Route path="/output/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />

          {/* Portfolio Route */}
          <Route path="/portfolio/layout-k" element={<ProtectedRoute><LayoutK /></ProtectedRoute>} />
          <Route path="/portfolio/layout-t" element={<ProtectedRoute><LayoutT /></ProtectedRoute>} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard/profile" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path="/dashboard/experience" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ExperiencePage />} />
          </Route>
          <Route path="/dashboard/education" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<EducationPage />} />
          </Route>
          <Route path="/dashboard/skills" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<SkillsPage />} />
          </Route>
          <Route path="/dashboard/projects" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ProjectsPage />} />
          </Route>
          <Route path="/dashboard/achievements" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AchievementsPage />} />
          </Route>
          <Route path="/dashboard/certifications" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<CertificationsPage />} />
          </Route>
          <Route path="/dashboard/portfolio" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<PortfolioPage />} />
          </Route>
          <Route path="/dashboard/resume" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ResumePage />} />
          </Route>
          <Route path="/dashboard/qr-code" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<QrCodePage />} />
          </Route>
          <Route path="/dashboard/interview" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DomainSelection />} />
          </Route>
          <Route path="/dashboard/interview/mock/:domain" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<MockInterview />} />
          </Route>
          <Route path="/dashboard/interview/result/:id" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<InterviewResult />} />
          </Route>

          {/* Default Fallback */}
          <Route
            path="*"
            element={
              isLoggedIn
                ? (user?.role === 'administrator'
                  ? <Navigate to="/admin/dashboard" replace />
                  : <Navigate to="/dashboard/profile" replace />)
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;

