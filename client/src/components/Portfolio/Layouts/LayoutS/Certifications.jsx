import React from "react";

export default function Certifications({ data = [] }) {
  return (
    <div>
      <h2>Certifications</h2>
      <div className="ls-underline" />
      <div style={{ marginTop: 12 }}>
        {data.length ? (
          <ul>
            {data.map((c, i) => (
              <li key={i} style={{ marginBottom:8 }}>
                <strong>{c.title}</strong>
                <div className="ls-muted">{c.issuer} {c.year ? `• ${c.year}` : ""}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ls-muted">No certifications yet</div>
        )}
      </div>
    </div>
  );
}
