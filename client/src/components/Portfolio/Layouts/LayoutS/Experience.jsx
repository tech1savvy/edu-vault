import React from "react";

export default function Experience({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Experience</h2>
      <div className="ls-timeline">
        {list.map((exp, i) => (
          <div className="ls-timeline-item" key={i}>
            <h3 className="ls-card-title">{exp.role || exp.position}</h3>
            <div className="ls-card-subtitle">{exp.company}</div>
            <div className="ls-card-meta">{exp.duration || `${exp.startDate || ""} ${exp.endDate ? "— " + exp.endDate : ""}`}</div>
            {exp.summary && <div className="ls-card-desc" style={{marginBottom: 8}}>{exp.summary}</div>}
            {exp.details && <div className="ls-card-desc">{exp.details}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
