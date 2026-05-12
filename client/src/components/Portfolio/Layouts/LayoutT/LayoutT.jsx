import React, { useState, useContext } from "react";
import "./LayoutT.css";
import Header from "./Header";
import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Achievements from "./Achievements";
import Certifications from "./Certifications";
import Contact from "./Contact";
import { ResumeContext } from "../../../../context/resumeContext";

const LayoutT = () => {
  const [theme, setTheme] = useState("dark");
  const {
    heading,
    projects,
    skills,
    experiences,
    education,
    achievements,
    certifications,
  } = useContext(ResumeContext);

  return (
    <div className="portfolio-layout-t" data-theme={theme}>
      {/* Background Grid Overlay */}
      <div className="layout-grid-overlay"></div>

      {/* Top Gradient Line */}
      <div className="layout-top-bar"></div>

      {/* Theme Switcher */}
      <div className="theme-switcher">
        <button
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "active" : ""}
          title="Dark Theme"
        >
          <span role="img" aria-label="Dark">
            🌙
          </span>
        </button>
        <button
          onClick={() => setTheme("ocean")}
          className={theme === "ocean" ? "active" : ""}
          title="Ocean Theme"
        >
          <span role="img" aria-label="Ocean">
            🌊
          </span>
        </button>
        <button
          onClick={() => setTheme("forest")}
          className={theme === "forest" ? "active" : ""}
          title="Forest Theme"
        >
          <span role="img" aria-label="Forest">
            🌲
          </span>
        </button>
      </div>

      <div className="portfolio-container">
        <Header data={heading} />

        <main className="portfolio-content">
          <About data={heading} />
          <Experience data={experiences} />
          <Education data={education} />
          <Projects data={projects} />
          <Skills data={skills} />
          <Achievements data={achievements} />
          <Certifications data={certifications} />
          <Contact data={heading} />
        </main>

        <footer className="portfolio-footer">
          <div className="footer-line"></div>
          <p>Built with passion and dedication</p>
        </footer>
      </div>
    </div>
  );
};

export default LayoutT;
