import React from "react";

export default function Education({ data = [] }) {
  return (
    <div>
      <h2>Education</h2>
      <div className="ls-underline" />
      <div className="ls-muted" style={{ marginTop: 12 }}>
        {data.length ? (
          data.map((ed, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{ed.degree}</div>
              <div className="ls-muted">{ed.institution} • {ed.year}</div>
            </div>
          ))
        ) : (
          <div>No education added.</div>
        )}
      </div>
    </div>
  );
}
