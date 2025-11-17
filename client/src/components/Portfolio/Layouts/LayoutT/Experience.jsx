// import React from 'react';
//
// const Experience = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Experience</h2>
//       {data && data.length > 0 ? (
//         <div className="experience-list">
//           {data.map((exp) => (
//             <div key={exp.id} className="experience-item">
//               <h3>{exp.role}</h3>
//               <h4>{exp.company}</h4>
//               <p className="experience-duration">{exp.duration}</p>
//               <p>{exp.details}</p>
//               <span className="badge">{exp.type}</span>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No experience to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Experience;

import React from "react";

const Experience = ({ data }) => {
  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Decorative Blobs for consistency */}
      <div className="about-blob blob-top-right"></div>
      <div className="about-blob blob-bottom-left"></div>

      <div className="about-content-wrapper">
        <h2 className="about-title">Experience</h2>
        <div className="about-underline"></div>

        {data && data.length > 0 ? (
          <div className="experience-timeline-wrapper">
            {/* Vertical Gradient Line */}
            <div className="experience-timeline-line"></div>

            <div className="experience-items-container">
              {data.map((exp, index) => (
                <div
                  key={exp.id}
                  className="experience-timeline-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="experience-dot"></div>

                  {/* Content Card */}
                  <div className="experience-card">
                    <div className="experience-header-row">
                      <div className="experience-main-info">
                        <h3 className="exp-role">{exp.role}</h3>
                        <h4 className="exp-company">{exp.company}</h4>
                      </div>

                      <span className="exp-type-badge">{exp.type}</span>
                    </div>

                    <p className="exp-duration">
                      <svg
                        className="exp-icon"
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
                      {exp.duration}
                    </p>

                    <p className="exp-details">{exp.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="achievement-empty">No experience to display.</p>
        )}
      </div>
    </section>
  );
};

export default Experience;
