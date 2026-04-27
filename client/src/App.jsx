import { Routes, Route } from "react-router-dom";
import "./App.css";
// Removed useEffect as setupAxiosInterceptors is no longer used here

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar";
// Removed AuthProvider, useAuth, setupAxiosInterceptors imports

import MatchResultsPage from "./pages/MatchResultsPage";

// Admin Components
import AdminDashboardPage from "./pages/AdminDashboardPage";
import JobDescriptionFormPage from "./pages/JobDescriptionFormPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import AdminRoute from "./components/AdminRoute";

// Form Components
import HeadingForm from "./components/Resume/Forms/HeadingForm";
import ExperienceForm from "./components/Resume/Forms/ExperienceForm";
import EducationForm from "./components/Resume/Forms/EducationForm";
import SkillsForm from "./components/Resume/Forms/SkillsForm";
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
import LayoutS from "./components/Portfolio/Layouts/LayoutS/LayoutS";
import LayoutK from "./components/Portfolio/Layouts/LayoutK/LayoutK";
import LayoutT from "./components/Portfolio/Layouts/LayoutT/LayoutT";

import CVTemplate from "./components/Resume/CVTemplate";
import FacultyMentoringDashboard from "./components/FacultyMentoringDashboard";
import MentorDashboard from "./pages/MentorDashboard";

import { Navigate } from "react-router-dom";


const RoleRoute = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      <Navbar />

      <main className="p-3">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

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
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <UserDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/job-descriptions/:jobId/applications"
            element={
              <AdminRoute>
                <JobApplicationsPage />
              </AdminRoute>
            }
          />

          {/* Faculty & Mentor Routes */}
          <Route path="/faculty-dashboard" element={<RoleRoute allowedRoles={['administrator', 'mentor']}><FacultyMentoringDashboard /></RoleRoute>} />
          <Route path="/mentor-dashboard" element={<RoleRoute allowedRoles={['administrator', 'mentor']}><MentorDashboard /></RoleRoute>} />



          {/* Input Routes (Student Only) */}
          <Route path="/input/heading" element={<RoleRoute allowedRoles={['student']}><HeadingForm /></RoleRoute>} />
          <Route path="/input/experience" element={<RoleRoute allowedRoles={['student']}><ExperienceForm /></RoleRoute>} />
          <Route path="/input/education" element={<RoleRoute allowedRoles={['student']}><EducationForm /></RoleRoute>} />
          <Route path="/input/skills" element={<RoleRoute allowedRoles={['student']}><Skills isInput={true} /></RoleRoute>} />
          <Route path="/input/projects" element={<RoleRoute allowedRoles={['student']}><ProjectsForm /></RoleRoute>} />
          <Route path="/input/certifications" element={<RoleRoute allowedRoles={['student']}><CertificationsForm /></RoleRoute>} />
          <Route path="/input/achievements" element={<RoleRoute allowedRoles={['student']}><AchievementsForm /></RoleRoute>} />

          {/* Output Routes (Student Only) */}
          <Route path="/output/heading" element={<RoleRoute allowedRoles={['student']}><Heading /></RoleRoute>} />
          <Route path="/output/experience" element={<RoleRoute allowedRoles={['student']}><Experience /></RoleRoute>} />
          <Route path="/output/education" element={<RoleRoute allowedRoles={['student']}><Education /></RoleRoute>} />
          <Route path="/output/skills" element={<RoleRoute allowedRoles={['student']}><Skills isInput={false} /></RoleRoute>} />
          <Route path="/output/projects" element={<RoleRoute allowedRoles={['student']}><Projects /></RoleRoute>} />
          <Route path="/output/certifications" element={<RoleRoute allowedRoles={['student']}><Certifications /></RoleRoute>} />
          <Route path="/output/achievements" element={<RoleRoute allowedRoles={['student']}><Achievements /></RoleRoute>} />

          {/* Portfolio Route (Student Only) */}
          <Route path="/portfolio/layout-s" element={<RoleRoute allowedRoles={['student']}><LayoutS /></RoleRoute>} />
          <Route path="/portfolio/layout-k" element={<RoleRoute allowedRoles={['student']}><LayoutK /></RoleRoute>} />
          <Route path="/portfolio/layout-t" element={<RoleRoute allowedRoles={['student']}><LayoutT /></RoleRoute>} />

          {/* Default Route */}
          <Route
            path="/"
            element={
              user && (user.role === 'administrator' || user.role === 'mentor') ? (
                  <Navigate to="/mentor-dashboard" />
              ) : (
                <div className="container text-center mt-5">
                  <h2>Welcome to EduVault Resume Builder</h2>
                  <p>
                    Select a component from the navigation menu to get started.
                  </p>
                </div>
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;

