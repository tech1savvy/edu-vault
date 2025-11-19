import React, { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";
import "./CVTemplate.css";

export default function CVTemplate({ visible = false }) {
  const {
    heading = {},
    education = [],
    experiences = [],
    projects = [],
    skills = [],
    achievements = [],
    certifications = [],
  } = useContext(ResumeContext) || {};

  // small helper to render comma list
  const joinTech = (arr = []) => (Array.isArray(arr) ? arr.join(", ") : arr);

  return (
    // keep id as cv-root so DownloadPdfButton(selector="#cv-root") works
    <div
      id="cv-root"
      className={`cv-root ${visible ? "cv-visible" : "cv-hidden-offscreen"}`}
      aria-hidden={!visible}
    >
      <div className="cv-page">
        {/* header */}
        <header className="cv-header">
          <div>
            <div className="cv-name">{heading.name || "Your Name"}</div>
            <div className="cv-title">{heading.title || "Professional Title"}</div>
          </div>

          <div className="cv-contact-block">
            {heading.linkedin && <div><strong>LinkedIn:</strong> {heading.linkedin}</div>}
            {heading.email && <div><strong>Email:</strong> {heading.email}</div>}
            {heading.github && <div><strong>Github:</strong> {heading.github}</div>}
            {heading.phone && <div><strong>Mobile:</strong> {heading.phone}</div>}
            {heading.location && <div><strong>Location:</strong> {heading.location}</div>}
          </div>
        </header>

        {/* Skills / Training quick */}
        <section className="cv-section cv-skills-training">
          <div className="cv-two-col">
            <div>
              <h4>SKILLS</h4>
              <div className="cv-skills">
                {skills.length ? skills.map((s, i) => (
                  <span className="cv-skill-pill" key={i}>{s.name || s}</span>
                )) : <div className="cv-muted">No skills added.</div>}
              </div>
            </div>

            <div>
              <h4>TRAINING</h4>
              <div className="cv-muted">
                {/* Use heading.training or show projects/training from data if present */}
                {heading.training || "Add training / summer training details in forms."}
                {/* Example: list of training objects could be shown if present */}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="cv-section">
            <h4>PROJECTS</h4>
            {projects.map((p, idx) => (
              <div className="cv-entry" key={idx}>
                <div className="cv-entry-left">
                  <div className="cv-role">{p.title}</div>
                  <div className="cv-company small">{joinTech(p.techStack)}</div>
                </div>
                <div className="cv-entry-right">
                  {p.description && <div className="cv-desc">{p.description}</div>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        <section className="cv-section">
          <h4>CERTIFICATIONS</h4>
          {certifications.length ? (
            <ul className="cv-list">
              {certifications.map((c, i) => (
                <li key={i}>
                  <strong>{c.title}</strong>
                  <div className="small cv-muted">{c.issuer} {c.year ? `• ${c.year}` : ""}</div>
                </li>
              ))}
            </ul>
          ) : <div className="cv-muted">No certifications.</div>}
        </section>

        {/* Achievements */}
        <section className="cv-section">
          <h4>ACHIEVEMENTS</h4>
          {achievements.length ? (
            <ul className="cv-list">
              {achievements.map((a, i) => <li key={i}>{a.title || a}</li>)}
            </ul>
          ) : <div className="cv-muted">No achievements.</div>}
        </section>

        {/* Experience */}
        <section className="cv-section">
          <h4>EXPERIENCE</h4>
          {experiences.length ? experiences.map((e, i) => (
            <div className="cv-entry" key={i}>
              <div className="cv-entry-left">
                <div className="cv-role">{e.role || e.position}</div>
                <div className="cv-company small">{e.company}</div>
              </div>
              <div className="cv-entry-right">
                <div className="cv-duration">{e.duration}</div>
                {e.summary && <div className="cv-desc">{e.summary}</div>}
              </div>
            </div>
          )) : <div className="cv-muted">No experience yet.</div>}
        </section>

        {/* Education */}
        <section className="cv-section">
          <h4>EDUCATION</h4>
          {education.length ? education.map((ed, i) => (
            <div className="cv-entry simple" key={i}>
              <div className="cv-entry-left">
                <div className="cv-role">{ed.degree}</div>
                <div className="cv-company small">{ed.institution}</div>
              </div>
              <div className="cv-entry-right">
                <div className="cv-duration">{ed.year}</div>
              </div>
            </div>
          )) : <div className="cv-muted">No education added.</div>}
        </section>

        {/* Footer */}
        <footer className="cv-footer">
          <div className="cv-muted small">Generated by EduVault — {new Date().getFullYear()}</div>
        </footer>
      </div>
    </div>
  );
}
