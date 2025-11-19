// import React, { useContext, useState } from "react";
// import "./LayoutS.css";
// import { ResumeContext } from "../../../../context/resumeContext";

// import Header from "./Header";
// import Experience from "./Experience";
// import Education from "./Education";
// import Projects from "./Projects";
// import Skills from "./Skills";
// import Achievements from "./Achievements";
// import Certifications from "./Certifications";
// import Contact from "./Contact";

// // PDF Button Component
// import DownloadPdfButton from "../../../Resume/DownloadPdfButton";

// export default function LayoutS() {
//   // read the shape your ResumeContext provides
//   const {
//     heading = {},
//     education = [],
//     experiences = [],
//     projects = [],
//     skills = [],
//     achievements = [],
//     certifications = [],
//   } = useContext(ResumeContext) || {};

//   // theme: 'sunset' | 'mint' | 'coral'
//   const [theme, setTheme] = useState("sunset");

//   return (
//     <div className="ls-root" data-theme={theme}>

//       {/* -------------------- THEME BUTTONS (TOP RIGHT) -------------------- */}
//       <div className="ls-theme-ui" role="toolbar" aria-label="Theme switcher">
//         <button
//           aria-pressed={theme === "sunset"}
//           title="Sunset Theme"
//           className={`ls-theme-btn ${theme === "sunset" ? "active" : ""}`}
//           onClick={() => setTheme("sunset")}
//         >
//           🌅
//         </button>

//         <button
//           aria-pressed={theme === "mint"}
//           title="Mint Theme"
//           className={`ls-theme-btn ${theme === "mint" ? "active" : ""}`}
//           onClick={() => setTheme("mint")}
//         >
//           🪴
//         </button>

//         <button
//           aria-pressed={theme === "coral"}
//           title="Coral Theme"
//           className={`ls-theme-btn ${theme === "coral" ? "active" : ""}`}
//           onClick={() => setTheme("coral")}
//         >
//           🔥
//         </button>
//       </div>

//       {/* -------------------- PRINTABLE AREA STARTS HERE -------------------- */}
//       {/* EVERYTHING YOU WANT INSIDE THE PDF MUST BE INSIDE THIS DIV */}
//       <div id="resume-root">

//         <main className="ls-container">
//           <Header data={heading} />

//           <section className="ls-cards">
//             <article className="ls-card">
//               <Experience data={experiences || []} />
//             </article>

//             <article className="ls-card">
//               <Education data={education || []} />
//             </article>

//             <article className="ls-card">
//               <Projects data={projects || []} />
//             </article>

//             <article className="ls-card">
//               <Skills data={skills || []} />
//             </article>

//             <article className="ls-card">
//               <Achievements data={achievements || []} />
//             </article>

//             <article className="ls-card">
//               <Certifications data={certifications || []} />
//             </article>

//             <article className="ls-card">
//               <Contact data={heading} />
//             </article>
//           </section>
//         </main>

//       </div>
//       {/* -------------------- PRINTABLE AREA ENDS HERE -------------------- */}

//       {/* -------------------- PDF DOWNLOAD BUTTON -------------------- */}
//       <div style={{ textAlign: "center", margin: "40px 0" }}>
//         <DownloadPdfButton filename="My-Resume.pdf" />
//       </div>

//     </div>
//   );
// }









import React, { useContext, useEffect, useState } from "react";
import "./LayoutS.css";
import { ResumeContext } from "../../../../context/resumeContext";

// local pieces (same as before)
import Header from "./Header";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Achievements from "./Achievements";
import Certifications from "./Certifications";
import Contact from "./Contact";

// PDF Button Component (keep)
import DownloadPdfButton from "../../../Resume/DownloadPdfButton";

// API helpers (same as LayoutT)
import {
  getHeading,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getAchievements,
  getCertifications,
} from "../../../../services/api";

export default function LayoutS() {
  // Context fallback values (used when API isn't available or before fetch)
  const {
    heading: ctxHeading = {},
    education: ctxEducation = [],
    experiences: ctxExperiences = [],
    projects: ctxProjects = [],
    skills: ctxSkills = [],
    achievements: ctxAchievements = [],
    certifications: ctxCertifications = [],
  } = useContext(ResumeContext) || {};

  // local state to hold fetched data (preferred)
  const [data, setData] = useState({
    heading: null,
    education: [],
    experiences: [],
    projects: [],
    skills: [],
    achievements: [],
    certifications: [],
  });

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // theme: 'sunset' | 'mint' | 'coral'
  const [theme, setTheme] = useState("sunset");

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // fetch everything in parallel (same set as LayoutT)
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

        if (!mounted) return;

        setData({
          heading: heading || null,
          projects: projects || [],
          skills: skills || [],
          experiences: experience || [],
          education: education || [],
          achievements: achievements || [],
          certifications: certifications || [],
        });
      } catch (err) {
        // If API fails (server off / not authenticated), fallback to context values
        console.error("LayoutS: failed to fetch resume data:", err);
        setFetchError(err);
        // We'll keep data null so UI uses context below
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []); // run once on mount

  // prefer fetched data, fallback to context
  const heading = data.heading ?? (Object.keys(ctxHeading || {}).length ? ctxHeading : null);
  const education = (data.education && data.education.length) ? data.education : ctxEducation || [];
  const experiences = (data.experiences && data.experiences.length) ? data.experiences : ctxExperiences || [];
  const projects = (data.projects && data.projects.length) ? data.projects : ctxProjects || [];
  const skills = (data.skills && data.skills.length) ? data.skills : ctxSkills || [];
  const achievements = (data.achievements && data.achievements.length) ? data.achievements : ctxAchievements || [];
  const certifications = (data.certifications && data.certifications.length) ? data.certifications : ctxCertifications || [];

  return (
    <div className="ls-root" data-theme={theme}>

      {/* -------------------- THEME BUTTONS (TOP RIGHT) -------------------- */}
      <div className="ls-theme-ui" role="toolbar" aria-label="Theme switcher">
        <button
          aria-pressed={theme === "sunset"}
          title="Sunset Theme"
          className={`ls-theme-btn ${theme === "sunset" ? "active" : ""}`}
          onClick={() => setTheme("sunset")}
        >
          🌅
        </button>

        <button
          aria-pressed={theme === "mint"}
          title="Mint Theme"
          className={`ls-theme-btn ${theme === "mint" ? "active" : ""}`}
          onClick={() => setTheme("mint")}
        >
          🪴
        </button>

        <button
          aria-pressed={theme === "coral"}
          title="Coral Theme"
          className={`ls-theme-btn ${theme === "coral" ? "active" : ""}`}
          onClick={() => setTheme("coral")}
        >
          🔥
        </button>
      </div>

      {/* -------------------- PRINTABLE AREA STARTS HERE -------------------- */}
      {/* EVERYTHING YOU WANT INSIDE THE PDF MUST BE INSIDE THIS DIV */}
      <div id="resume-root">

        <main className="ls-container">
          <Header data={heading || {}} />

          {/* show a simple loading or error notice inside the content area (non-blocking) */}
          {loading && <div className="ls-loading-banner">Loading...</div>}
          {fetchError && <div className="ls-error-banner">Unable to fetch remote data — using local preview.</div>}

          <section className="ls-cards">
            <article className="ls-card">
              <Experience data={experiences || [] } />
            </article>

            <article className="ls-card">
              <Education data={education || [] } />
            </article>

            <article className="ls-card">
              <Projects data={projects || [] } />
            </article>

            <article className="ls-card">
              <Skills data={skills || [] } />
            </article>

            <article className="ls-card">
              <Achievements data={achievements || [] } />
            </article>

            <article className="ls-card">
              <Certifications data={certifications || [] } />
            </article>

            <article className="ls-card">
              <Contact data={heading || {}} />
            </article>
          </section>
        </main>

      </div>
      {/* -------------------- PRINTABLE AREA ENDS HERE -------------------- */}

      {/* -------------------- PDF DOWNLOAD BUTTON -------------------- */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <DownloadPdfButton filename="My-Resume.pdf" />
      </div>

    </div>
  );
}
