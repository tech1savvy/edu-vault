import React from "react";

export default function Projects({ data = [] }) {
  return (
    <div>
      <h2>Projects</h2>
      <div className="ls-underline" />
      <div style={{ marginTop: 12 }}>
        {data.length ? (
          <div className="ls-two-col">
            {data.map((p, i) => (
              <div key={i} className="ls-item">
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div className="ls-muted" style={{ marginTop:6 }}>{p.techStack && p.techStack.join(", ")}</div>
                {p.description && <p style={{ marginTop:8 }}>{p.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="ls-muted">No projects to display.</div>
        )}
      </div>
    </div>
  );
}
