import React from "react";

export default function Skills({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Skills</h2>
      <div className="ls-skills-wrapper">
        {list.map((s, i) => {
          const name = typeof s === "string" ? s : s.name || s.skill || "";
          const level = typeof s === "string" ? "" : s.level || s.levelName || "";
          return (
            <div className="ls-skill-pill" key={i}>
              <span>{name}</span>
              {level && <span className="level">{level}</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
