import React, { useState, useEffect, useContext } from "react";
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

import {
  getHeading,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getAchievements,
  getCertifications,
} from "../../../../services/api";

// 👉 PDF Button
import DownloadPdfButton from "../../../Resume/DownloadPdfButton";

const LayoutT = () => {
  const [theme, setTheme] = useState("dark");

  const [data, setData] = useState({
    heading: null,
    projects: [],
    skills: [],
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
  });
  
  // Context fallback values
  const {
    heading: ctxHeading = {},
    education: ctxEducation = [],
    experiences: ctxExperiences = [],
    projects: ctxProjects = [],
    skills: ctxSkills = [],
    achievements: ctxAchievements = [],
    certifications: ctxCertifications = [],
  } = useContext(ResumeContext) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heading,
          projects,
          skills,
          experience,
          education,
          achievements,
          certifications,
        ] = await Promise.all([
          getHeading(),
          getProjects(),
          getSkills(),
          getExperience(),
          getEducation(),
          getAchievements(),
          getCertifications(),
        ]);

        setData({
          heading,
          projects,
          skills,
          experience,
          education,
          achievements,
          certifications,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Prefer fetched data, fallback to context
  const finalHeading = data.heading ?? (Object.keys(ctxHeading || {}).length ? ctxHeading : null);
  const finalEducation = (data.education && data.education.length) ? data.education : ctxEducation || [];
  const finalExperience = (data.experience && data.experience.length) ? data.experience : ctxExperiences || [];
  const finalProjects = (data.projects && data.projects.length) ? data.projects : ctxProjects || [];
  const finalSkills = (data.skills && data.skills.length) ? data.skills : ctxSkills || [];
  const finalAchievements = (data.achievements && data.achievements.length) ? data.achievements : ctxAchievements || [];
  const finalCertifications = (data.certifications && data.certifications.length) ? data.certifications : ctxCertifications || [];

  return (
    <div className="portfolio-layout-t" data-theme={theme}>
      {/* Background Effects */}
      <div className="layout-grid-overlay"></div>
      <div className="layout-top-bar"></div>

      {/* Theme Switcher */}
      <div className="theme-switcher">
        <button
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "active" : ""}
        >
          🌙
        </button>
        <button
          onClick={() => setTheme("ocean")}
          className={theme === "ocean" ? "active" : ""}
        >
          🌊
        </button>
        <button
          onClick={() => setTheme("forest")}
          className={theme === "forest" ? "active" : ""}
        >
          🌲
        </button>
      </div>

      {/* ------------ PRINTABLE AREA ------------ */}
      <div id="resume-root">
        <div className="portfolio-container">
          <Header data={finalHeading} />

          <main className="portfolio-content">
            <About data={finalHeading} />
            <Experience data={finalExperience} />
            <Education data={finalEducation} />
            <Projects data={finalProjects} />
            <Skills data={finalSkills} />
            <Achievements data={finalAchievements} />
            <Certifications data={finalCertifications} />
            <Contact data={finalHeading} />
          </main>

          <footer className="portfolio-footer">
            <div className="footer-line"></div>
            <p>Built with passion and dedication</p>
          </footer>
        </div>
      </div>
      {/* ------------ PRINTABLE AREA END ------------ */}

      {/* ------------ DOWNLOAD BUTTON ------------ */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <DownloadPdfButton filename="My-Resume.pdf" />
      </div>
    </div>
  );
};

export default LayoutT;
