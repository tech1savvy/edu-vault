import React, { useState, useEffect, useContext } from "react";
import "./LayoutK.css";
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

const LayoutK = () => {
  const [theme, setTheme] = useState("dark");
  const [heading, setHeading] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);

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
        setHeading(await getHeading());
        setProjects(await getProjects());
        setSkills(await getSkills());
        setExperience(await getExperience());
        setEducation(await getEducation());
        setAchievements(await getAchievements());
        setCertifications(await getCertifications());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Prefer fetched data, fallback to context
  const finalHeading = heading ?? (Object.keys(ctxHeading || {}).length ? ctxHeading : null);
  const finalEducation = (education && education.length) ? education : ctxEducation || [];
  const finalExperience = (experience && experience.length) ? experience : ctxExperiences || [];
  const finalProjects = (projects && projects.length) ? projects : ctxProjects || [];
  const finalSkills = (skills && skills.length) ? skills : ctxSkills || [];
  const finalAchievements = (achievements && achievements.length) ? achievements : ctxAchievements || [];
  const finalCertifications = (certifications && certifications.length) ? certifications : ctxCertifications || [];

  return (
    <div className="portfolio-layout-k" data-theme={theme}>
      {/* Theme Switcher */}
      <div className="theme-switcher">
        <button onClick={() => setTheme("dark")}>🌙</button>
        <button onClick={() => setTheme("light")}>☀️</button>
        <button onClick={() => setTheme("blue")}>💧</button>
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

export default LayoutK;
