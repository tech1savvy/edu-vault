// import React from 'react';
//
// const Certifications = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Certifications</h2>
//       {data && data.length > 0 ? (
//         <ul className="certifications-list">
//           {data.map((cert) => (
//             <li key={cert.id}>
//               <strong>{cert.name}</strong> from {cert.issuer} ({cert.date})
//               {cert.credentialId && ` - Credential ID: ${cert.credentialId}`}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No certifications to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Certifications;

import React from "react";

const Certifications = ({ data }) => {
  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Reusing header styles for consistency */}
      <h2 className="about-title">Certifications</h2>
      <div className="about-underline"></div>

      {data && data.length > 0 ? (
        <div className="cert-grid">
          {data.map((cert, index) => (
            <div
              key={cert.id}
              className="cert-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Background Glow (Top Right) */}
              <div className="cert-card-glow"></div>

              <div className="cert-card-content">
                <div className="cert-main-info">
                  {/* Gradient Icon Box */}
                  <div className="cert-icon-box">
                    <svg
                      className="cert-icon-svg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>

                  <div className="cert-text-details">
                    <h3 className="cert-name">{cert.name}</h3>

                    <p className="cert-issuer">{cert.issuer}</p>

                    <p className="cert-date">
                      <svg
                        className="cert-date-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {cert.date}
                    </p>
                  </div>
                </div>

                {cert.credentialId && (
                  <div className="cert-footer">
                    <p className="cert-credential">
                      <span className="cert-credential-label">
                        Credential ID:
                      </span>{" "}
                      <span className="cert-credential-value">
                        {cert.credentialId}
                      </span>
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
};

export default Certifications;
