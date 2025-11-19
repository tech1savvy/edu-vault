import React from "react";

export default function Achievements({ data = [] }) {
  return (
    <div>
      <h2>Achievements</h2>
      <div className="ls-underline" />
      <div style={{ marginTop: 12 }}>
        {data.length ? (
          <ul>
            {data.map((a, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <strong>{a.title || a}</strong>
                {a.details && <div className="ls-muted">{a.details}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="ls-muted">No achievements yet</div>
        )}
      </div>
    </div>
  );
}
