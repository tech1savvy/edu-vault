import React from "react";

export default function Skills({ data = [] }) {
  return (
    <div>
      <h2>Skills</h2>
      <div className="ls-underline" />
      <div style={{ marginTop: 12 }}>
        {data.length ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {data.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.02)",
                fontWeight: 600,
                color: "var(--title-color)"
              }}>{s.name || s}</div>
            ))}
          </div>
        ) : (
          <div className="ls-muted">No skills to display.</div>
        )}
      </div>
    </div>
  );
}
