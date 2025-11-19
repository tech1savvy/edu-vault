// import React from "react";

// export default function Certifications({ data = [] }) {
//   return (
//     <div>
//       <h2>Certifications</h2>
//       <div className="ls-underline" />
//       <div style={{ marginTop: 12 }}>
//         {data.length ? (
//           <ul>
//             {data.map((c, i) => (
//               <li key={i} style={{ marginBottom:8 }}>
//                 <strong>{c.title}</strong>
//                 <div className="ls-muted">{c.issuer} {c.year ? `• ${c.year}` : ""}</div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="ls-muted">No certifications yet</div>
//         )}
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function Certifications({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <section className="portfolio-section about-section-enhanced">
      <h2 className="about-title">Certifications</h2>
      <div className="about-underline"></div>

      {list.length ? (
        <div className="cert-grid">
          {list.map((cert, i) => (
            <div className="cert-card" key={cert.id ?? i} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="cert-card-glow" />
              <div className="cert-card-content">
                <div className="cert-main-info">
                  <div className="cert-icon-box">
                    {/* small check icon SVG */}
                    <svg className="cert-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>

                  <div className="cert-text-details">
                    <h3 className="cert-name">{cert.title || cert.name || "Certification"}</h3>
                    <p className="cert-issuer">{cert.issuer || cert.organization}</p>
                    <p className="cert-date">{cert.date || cert.year || ""}</p>
                  </div>
                </div>

                {cert.credentialId && (
                  <div className="cert-footer">
                    <p className="cert-credential">
                      <span className="cert-credential-label">Cred ID:</span>{" "}
                      <span className="cert-credential-value">{cert.credentialId}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="achievement-empty">No certifications to display.</p>
      )}
    </section>
  );
}
