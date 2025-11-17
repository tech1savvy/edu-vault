// import React from 'react';
//
// const Education = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Education</h2>
//       {data && data.length > 0 ? (
//         <div className="education-list">
//           {data.map((edu) => (
//             <div key={edu.id} className="education-item">
//               <h3>{edu.degree}</h3>
//               <h4>{edu.institution}</h4>
//               <p className="education-duration">{edu.duration}</p>
//               <p>{edu.fieldOfStudy}</p>
//               <p>{edu.details}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No education to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Education;

import React from "react";

const Education = ({ data }) => {
  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Reuse generic header styles */}
      <h2 className="about-title">Education</h2>
      <div className="about-underline"></div>

      {data && data.length > 0 ? (
        <div className="education-timeline-wrapper">
          {/* The Vertical Gradient Line */}
          <div className="education-timeline-line"></div>

          <div className="education-items-container">
            {data.map((edu, index) => (
              <div
                key={edu.id}
                className="education-timeline-item"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="education-dot"></div>

                {/* Content Card */}
                <div className="education-card">
                  <h3 className="edu-degree">{edu.degree}</h3>

                  <h4 className="edu-institution">{edu.institution}</h4>

                  <p className="edu-duration">
                    <svg
                      className="edu-icon"
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
                    {edu.duration}
                  </p>

                  <p className="edu-field">{edu.fieldOfStudy}</p>

                  <p className="edu-details">{edu.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="achievement-empty">No education to display.</p>
      )}
    </section>
  );
};

export default Education;
