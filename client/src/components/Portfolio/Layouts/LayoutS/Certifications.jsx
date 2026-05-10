import React from "react";

export default function Certifications({ data = [] }) {
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return null;

  return (
    <section className="ls-section">
      <h2 className="ls-section-title">Certifications</h2>
      <div className="ls-bento-grid">
        {list.map((c, i) => (
          <div className="ls-bento-card" key={i}>
            <h3 className="ls-card-title">{c.title || c.name}</h3>
            <div className="ls-card-subtitle">{c.issuer || c.organization}</div>
            {(c.year || c.date) && <div className="ls-card-meta">{c.year || c.date}</div>}
            {c.credentialId && <div className="ls-card-desc" style={{fontSize: '12px'}}>Cred ID: {c.credentialId}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
