import React, { useContext } from "react";
import "./CVTemplate.css";
import { ResumeContext } from "../../context/resumeContext";

export default function CVTemplate({ visible = true, dataProp = null }) {
  const contextData = useContext(ResumeContext) || {};
  
  // Use dataProp if provided, otherwise fallback to context
  const sourceData = dataProp || contextData;

  const heading = sourceData.heading || {};
  const experiences = sourceData.experiences || [];
  const education = sourceData.education || [];
  const projects = sourceData.projects || [];
  const skills = sourceData.skills || [];
  const achievements = sourceData.achievements || [];
  const certifications = sourceData.certifications || [];

  // Hidden styling so html2pdf can still capture it
  // Using left: -9999px puts it out of view but html2pdf can target it directly
  const style = visible
    ? {}
    : { position: "absolute", left: "-9999px", top: 0, width: "210mm" };

  // Helper to format contact info
  const formatContact = () => {
    const parts = [];
    if (heading.location || heading.city) parts.push(heading.location || heading.city);
    if (heading.email) parts.push(heading.email);
    if (heading.phone || heading.contact) parts.push(heading.phone || heading.contact);
    
    // Convert links to clickable anchors
    if (heading.linkedin) {
      parts.push(`<a href="${heading.linkedin}" target="_blank">LinkedIn</a>`);
    }
    if (heading.github) {
      parts.push(`<a href="${heading.github}" target="_blank">GitHub</a>`);
    }
    if (heading.website || heading.portfolio) {
      parts.push(`<a href="${heading.website || heading.portfolio}" target="_blank">Portfolio</a>`);
    }
    
    return parts.join(" | ");
  };

  return (
    <div id="cv-template" style={style} className="cv-template">
      {/* 1. HEADING */}
      <h1>{heading.name || heading.fullName || "YOUR NAME"}</h1>
      <div 
        className="cv-contact" 
        dangerouslySetInnerHTML={{ __html: formatContact() || "City, State | email@example.com | +1 234 567 8900 | LinkedIn | GitHub" }}
      />
      <hr className="cv-divider" style={{ borderTopWidth: "3px" }} />

      {/* 2. PROFESSIONAL SUMMARY */}
      {(heading.summary || heading.description) && (
        <>
          <div className="cv-section-title">PROFESSIONAL SUMMARY</div>
          <hr className="cv-divider" />
          <p className="cv-paragraph">
            {heading.summary || heading.description}
          </p>
        </>
      )}

      {/* 3. TECHNICAL SKILLS */}
      {skills.length > 0 && (
        <>
          <div className="cv-section-title">TECHNICAL SKILLS</div>
          <hr className="cv-divider" />
          {/* If skills are just a flat array of strings, we'll join them. 
              If the user categorized them (e.g., Languages, Backend), we'd render rows.
              For now, we'll assume a flat array and render it nicely, or grouped if they used colons. */}
          <div className="cv-skills-row">
            <strong>Skills: </strong>
            {skills.map(s => (typeof s === 'string' ? s : s.name)).join(", ")}
          </div>
        </>
      )}

      {/* 4. PROJECTS */}
      {projects.length > 0 && (
        <>
          <div className="cv-section-title">PROJECTS</div>
          <hr className="cv-divider" />
          {projects.map((proj, idx) => (
            <div className="cv-item" key={idx}>
              <div className="cv-item-header">
                <span className="cv-item-title">
                  {proj.title}
                  {proj.link && (
                    <>
                      {" | "}
                      <a href={proj.link} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </>
                  )}
                </span>
                <span className="cv-item-date">{proj.timeline || proj.duration || proj.year}</span>
              </div>
              {proj.techStack && (
                <div className="cv-item-subtitle">
                  Stack: {Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack}
                </div>
              )}
              {proj.description && (
                <ul className="cv-list">
                  {/* Split description by newlines or sentences to make bullets if possible, otherwise just one bullet */}
                  {proj.description.split('\n').filter(p => p.trim()).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* 5. EXPERIENCE */}
      {experiences.length > 0 && (
        <>
          <div className="cv-section-title">EXPERIENCE</div>
          <hr className="cv-divider" />
          {experiences.map((exp, idx) => (
            <div className="cv-item" key={idx}>
              <div className="cv-item-header">
                <span className="cv-item-title">{exp.role || exp.position}</span>
                <span className="cv-item-date">{exp.duration || `${exp.startDate || ""} ${exp.endDate ? "- " + exp.endDate : ""}`}</span>
              </div>
              <div className="cv-item-subtitle">{exp.company} {exp.location ? `| ${exp.location}` : ""}</div>
              {exp.details && (
                <ul className="cv-list">
                  {exp.details.split('\n').filter(p => p.trim()).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* 6. CERTIFICATIONS & ACHIEVEMENTS */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <>
          <div className="cv-section-title">CERTIFICATIONS & ACHIEVEMENTS</div>
          <hr className="cv-divider" />
          <ul className="cv-cert-list">
            {certifications.map((cert, idx) => (
              <li key={`cert-${idx}`}>
                <strong>{cert.name || cert.title}</strong>
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.date && ` (${cert.date})`}
              </li>
            ))}
            {achievements.map((ach, idx) => (
              <li key={`ach-${idx}`}>
                {typeof ach === "string" ? (
                  ach
                ) : (
                  <>
                    <strong>{ach.title || ach.name}</strong>
                    {ach.description && ` - ${ach.description}`}
                    {ach.date && ` (${ach.date})`}
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 7. EDUCATION */}
      {education.length > 0 && (
        <>
          <div className="cv-section-title">EDUCATION</div>
          <hr className="cv-divider" />
          {education.map((edu, idx) => (
            <div className="cv-item" key={idx} style={{ marginBottom: "8px" }}>
              <div className="cv-item-header">
                <span className="cv-item-title">{edu.degree || edu.program}</span>
                <span className="cv-item-date">{edu.year || edu.duration || `${edu.startDate || ""} ${edu.endDate ? "- " + edu.endDate : ""}`}</span>
              </div>
              <div className="cv-item-subtitle" style={{ fontStyle: "italic", color: "#444" }}>
                {edu.college || edu.institution} {edu.location ? `, ${edu.location}` : ""}
                {edu.score && ` | ${edu.score.includes('%') || edu.score.toLowerCase().includes('cgpa') ? edu.score : `Score: ${edu.score}`}`}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
