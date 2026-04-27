import React from "react";

export default function Projects({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Projects</h2>
      <div className="ls-bento-grid">
        {list.map((p, i) => (
          <div className="ls-bento-card" key={i}>
            <h3 className="ls-card-title">{p.title}</h3>
            {p.techStack && (
              <div className="ls-card-subtitle">
                {Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack}
              </div>
            )}
            {p.description && <p className="ls-card-desc">{p.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
