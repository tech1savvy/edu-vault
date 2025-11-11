import { Routes, Route } from "react-router";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar";

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

import LayoutT from "./components/Portfolio/Layouts/LayoutT/LayoutT";


function App() {
  return (
    <>
      <Navbar />
      <main className="p-3">
        <Routes>
          {/* Input Routes */}
          <Route path="/input/heading" element={<HeadingForm />} />
          <Route path="/input/experience" element={<ExperienceForm />} />
          <Route path="/input/education" element={<EducationForm />} />
          <Route path="/input/skills" element={<Skills isInput={true} />} />
          <Route path="/input/projects" element={<ProjectsForm />} />
          <Route path="/input/certifications" element={<CertificationsForm />} />
          <Route path="/input/achievements" element={<AchievementsForm />} />

          {/* Output Routes */}
          <Route path="/output/heading" element={<Heading />} />
          <Route path="/output/experience" element={<Experience />} />
          <Route path="/output/education" element={<Education />} />
          <Route path="/output/skills" element={<Skills isInput={false} />} />
          <Route path="/output/projects" element={<Projects />} />
          <Route path="/output/certifications" element={<Certifications />} />
          <Route path="/output/achievements" element={<Achievements />} />
          
          {/* Portfolio Route */}
          <Route path="/portfolio/layoutT" element={<LayoutT />} />

          {/* Default Route */}
          <Route path="/" element={<div className="container text-center mt-5"><h2>Welcome to EduVault Resume Builder</h2><p>Select a component from the navigation menu to get started.</p></div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;