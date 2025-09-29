import { Routes, Route } from "react-router";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar";

import AchievementsForm from "./components/Resume/Forms/AchievementsForm";
import CertificationsForm from "./components/Resume/Forms/CertificationsForm";
import EducationForm from "./components/Resume/Forms/EducationForm";
import ExperienceForm from "./components/Resume/Forms/ExperienceForm";
import HeadingForm from "./components/Resume/Forms/HeadingForm";
import ProjectsForm from "./components/Resume/Forms/ProjectsForm";
import SkillsForm from "./components/Resume/Forms/SkillsForm";

import Achievements from "./components/Resume/Achievements";
import Certifications from "./components/Resume/Certifications";
import Education from "./components/Resume/Education";
import Experience from "./components/Resume/Experience";
import Heading from "./components/Resume/Heading";
import Projects from "./components/Resume/Projects";
import Skills from "./components/Resume/Skills";

function App() {
  return (
    <>
      <Navbar />
      <main className="p-3">
        <Routes>
          <Route path="/input/heading" element={<HeadingForm />} />
          <Route path="/input/experience" element={<ExperienceForm />} />
          <Route path="/input/education" element={<EducationForm />} />
          <Route path="/input/skills" element={<SkillsForm />} />
          <Route path="/input/projects" element={<ProjectsForm />} />
          <Route
            path="/input/certifications"
            element={<CertificationsForm />}
          />
          <Route path="/input/achievements" element={<AchievementsForm />} />

          <Route path="/output/heading" element={<Heading />} />
          <Route path="/output/experience" element={<Experience />} />
          <Route path="/output/education" element={<Education />} />
          <Route path="/output/skills" element={<Skills />} />
          <Route path="/output/projects" element={<Projects />} />
          <Route path="/output/certifications" element={<Certifications />} />
          <Route path="/output/achievements" element={<Achievements />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
