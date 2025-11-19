// import React from "react";

// export default function Education({ data = [] }) {
//   return (
//     <div>
//       <h2>Education</h2>
//       <div className="ls-underline" />
//       <div className="ls-muted" style={{ marginTop: 12 }}>
//         {data.length ? (
//           data.map((ed, i) => (
//             <div key={i} style={{ marginBottom: 12 }}>
//               <div style={{ fontWeight: 700 }}>{ed.degree}</div>
//               <div className="ls-muted">{ed.institution} • {ed.year}</div>
//             </div>
//           ))
//         ) : (
//           <div>No education added.</div>
//         )}
//       </div>
//     </div>
//   );
// }




import React from "react";

export default function Education({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <section className="portfolio-section about-section-enhanced">
      <h2 className="about-title">Education</h2>
      <div className="about-underline"></div>

      {list.length ? (
        <div className="education-timeline-wrapper">
          <div className="education-timeline-line" />
          <div className="education-items-container">
            {list.map((edu, i) => (
              <div className="education-timeline-item" key={edu.id ?? i} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="education-dot" />
                <div className="education-card">
                  <h3 className="edu-degree">{edu.degree || edu.program || edu.title}</h3>
                  <h4 className="edu-institution">{edu.institution || edu.school}</h4>
                  <p className="edu-duration">{edu.duration || edu.year || `${edu.startDate || ""} ${edu.endDate ? "— " + edu.endDate : ""}`}</p>
                  {edu.fieldOfStudy && <p className="edu-field">{edu.fieldOfStudy}</p>}
                  {edu.details && <p className="edu-details">{edu.details}</p>}
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
}
