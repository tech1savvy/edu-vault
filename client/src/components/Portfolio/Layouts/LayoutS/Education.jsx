import React from "react";

export default function Education({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Education</h2>
      <div className="ls-timeline">
        {list.map((ed, i) => (
          <div className="ls-timeline-item" key={i}>
            <h3 className="ls-card-title">{ed.degree || ed.program || ed.title}</h3>
            <div className="ls-card-subtitle">{ed.institution || ed.school}</div>
            <div className="ls-card-meta">{ed.year || ed.duration || `${ed.startDate || ""} ${ed.endDate ? "— " + ed.endDate : ""}`}</div>
            {ed.fieldOfStudy && <div className="ls-card-desc">{ed.fieldOfStudy}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
