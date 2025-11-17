// import React from 'react';
//
// const Achievements = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Achievements</h2>
//       {data && data.length > 0 ? (
//         <ul className="achievements-list">
//           {data.map((ach) => (
//             <li key={ach.id}>
//               <strong>{ach.title}</strong> ({ach.date}): {ach.description}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No achievements to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Achievements;

import React from "react";

const Achievements = ({ data }) => {
  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Reusing the header style from About section for consistency */}
      <h2 className="about-title">Achievements</h2>
      <div className="about-underline"></div>

      {data && data.length > 0 ? (
        <div className="achievements-wrapper">
          {data.map((ach, index) => (
            <div
              key={ach.id}
              className="achievement-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Timeline Dot */}
              <div className="achievement-dot"></div>

              <div className="achievement-header">
                <h3 className="achievement-item-title">{ach.title}</h3>

                <span className="achievement-date-badge">
                  <svg
                    className="achievement-icon"
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
                  {ach.date}
                </span>
              </div>

              <p className="achievement-description">{ach.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="achievement-empty">No achievements to display.</p>
      )}
    </section>
  );
};

export default Achievements;
