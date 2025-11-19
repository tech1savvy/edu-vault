// import React from "react";

// export default function Experience({ data = [] }) {
//   return (
//     <div>
//       <h2>Experience</h2>
//       <div className="ls-underline" />
//       <div className="ls-muted" style={{ marginTop: 12 }}>
//         {data.length ? (
//           data.map((exp, i) => (
//             <div key={i} style={{ marginBottom: 14 }}>
//               <div style={{ fontWeight: 700 }}>{exp.role || exp.position}</div>
//               <div className="ls-muted" style={{ marginTop: 6 }}>{exp.company} • {exp.duration}</div>
//               {exp.summary && <p style={{ marginTop: 8 }}>{exp.summary}</p>}
//             </div>
//           ))
//         ) : (
//           <div>No experience to display.</div>
//         )}
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function Experience({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <section className="portfolio-section about-section-enhanced">
      <div className="about-blob blob-top-right" />
      <div className="about-blob blob-bottom-left" />

      <div className="about-content-wrapper">
        <h2 className="about-title">Experience</h2>
        <div className="about-underline"></div>

        {list.length ? (
          <div className="experience-timeline-wrapper">
            <div className="experience-timeline-line" />
            <div className="experience-items-container">
              {list.map((exp, i) => (
                <div className="experience-timeline-item" key={exp.id ?? i} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="experience-dot" />
                  <div className="experience-card">
                    <div className="experience-header-row">
                      <div className="experience-main-info">
                        <h3 className="exp-role">{exp.role || exp.position}</h3>
                        <h4 className="exp-company">{exp.company}</h4>
                      </div>
                      {exp.type && <span className="exp-type-badge">{exp.type}</span>}
                    </div>

                    <p className="exp-duration">{exp.duration || `${exp.startDate || ""} ${exp.endDate ? "— " + exp.endDate : ""}`}</p>
                    {exp.details && <p className="exp-details">{exp.details}</p>}
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
}
