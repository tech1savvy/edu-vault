// import React, { useState, useEffect } from 'react';
// import './LayoutT.css';
// import Header from './Header';
// import About from './About';
// import Experience from './Experience';
// import Education from './Education';
// import Projects from './Projects';
// import Skills from './Skills';
// import Achievements from './Achievements';
// import Certifications from './Certifications';
// import Contact from './Contact';
// import {
//   getHeading,
//   getProjects,
//   getSkills,
//   getExperience,
//   getEducation,
//   getAchievements,
//   getCertifications,
// } from '../../../../services/api';
//
// const LayoutT = () => {
//   const [theme, setTheme] = useState('dark');
//   const [heading, setHeading] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [skills, setSkills] = useState([]);
//   const [experience, setExperience] = useState([]);
//   const [education, setEducation] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [certifications, setCertifications] = useState([]);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setHeading(await getHeading());
//         setProjects(await getProjects());
//         setSkills(await getSkills());
//         setExperience(await getExperience());
//         setEducation(await getEducation());
//         setAchievements(await getAchievements());
//         setCertifications(await getCertifications());
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       }
//     };
//     fetchData();
//   }, []);
//
//   return (
//     <div className="portfolio-layout-t" data-theme={theme}>
//       <div className="theme-switcher">
//         <button onClick={() => setTheme('dark')}>🌙</button>
//         <button onClick={() => setTheme('light')}>☀️</button>
//         <button onClick={() => setTheme('blue')}>💧</button>
//       </div>
//       <div className="portfolio-container">
//         <Header data={heading} />
//         <main className="portfolio-content">
//           <About data={heading} />
//           <Experience data={experience} />
//           <Education data={education} />
//           <Projects data={projects} />
//           <Skills data={skills} />
//           <Achievements data={achievements} />
//           <Certifications data={certifications} />
//           <Contact data={heading} />
//         </main>
//       </div>
//     </div>
//   );
// };
//
// export default LayoutT;

import React, { useState, useEffect } from "react";
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
import {
  getHeading,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getAchievements,
  getCertifications,
} from "../../../../services/api";

const LayoutT = () => {
  const [theme, setTheme] = useState("dark");

  // Consolidated state object to match the new logic
  const [data, setData] = useState({
    heading: null,
    projects: [],
    skills: [],
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.all for faster concurrent loading
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
        <Header data={data.heading} />

        <main className="portfolio-content">
          <About data={data.heading} />
          <Experience data={data.experience} />
          <Education data={data.education} />
          <Projects data={data.projects} />
          <Skills data={data.skills} />
          <Achievements data={data.achievements} />
          <Certifications data={data.certifications} />
          <Contact data={data.heading} />
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
