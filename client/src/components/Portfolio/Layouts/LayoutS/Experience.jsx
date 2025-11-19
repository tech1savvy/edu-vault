import React from "react";

export default function Experience({ data = [] }) {
  return (
    <div>
      <h2>Experience</h2>
      <div className="ls-underline" />
      <div className="ls-muted" style={{ marginTop: 12 }}>
        {data.length ? (
          data.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700 }}>{exp.role || exp.position}</div>
              <div className="ls-muted" style={{ marginTop: 6 }}>{exp.company} • {exp.duration}</div>
              {exp.summary && <p style={{ marginTop: 8 }}>{exp.summary}</p>}
            </div>
          ))
        ) : (
          <div>No experience to display.</div>
        )}
      </div>
    </div>
  );
}
