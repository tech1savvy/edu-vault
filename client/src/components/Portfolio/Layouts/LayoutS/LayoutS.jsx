import React, { useContext, useState } from "react";
import "./LayoutS.css";
import { ResumeContext } from "../../../../context/resumeContext";

import Header from "./Header";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Achievements from "./Achievements";
import Certifications from "./Certifications";
import Contact from "./Contact";

// PDF Button Component
import DownloadPdfButton from "../../../Resume/DownloadPdfButton";

export default function LayoutS() {
  // read the shape your ResumeContext provides
  const {
    heading = {},
    education = [],
    experiences = [],
    projects = [],
    skills = [],
    achievements = [],
    certifications = [],
  } = useContext(ResumeContext) || {};

  // theme: 'sunset' | 'mint' | 'coral'
  const [theme, setTheme] = useState("sunset");

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
          <Header data={heading} />

          <section className="ls-cards">
            <article className="ls-card">
              <Experience data={experiences || []} />
            </article>

            <article className="ls-card">
              <Education data={education || []} />
            </article>

            <article className="ls-card">
              <Projects data={projects || []} />
            </article>

            <article className="ls-card">
              <Skills data={skills || []} />
            </article>

            <article className="ls-card">
              <Achievements data={achievements || []} />
            </article>

            <article className="ls-card">
              <Certifications data={certifications || []} />
            </article>

            <article className="ls-card">
              <Contact data={heading} />
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
