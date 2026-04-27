import React from "react";

export default function Achievements({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Achievements</h2>
      <div className="ls-timeline">
        {list.map((a, i) => (
          <div className="ls-timeline-item" key={i}>
            <h3 className="ls-card-title">{a.title || a.name || a}</h3>
            {(a.details || a.description) && <div className="ls-card-desc">{a.details || a.description}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
