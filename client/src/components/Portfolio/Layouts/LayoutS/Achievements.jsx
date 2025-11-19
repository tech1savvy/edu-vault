// import React from "react";

// export default function Achievements({ data = [] }) {
//   return (
//     <div>
//       <h2>Achievements</h2>
//       <div className="ls-underline" />
//       <div style={{ marginTop: 12 }}>
//         {data.length ? (
//           <ul>
//             {data.map((a, i) => (
//               <li key={i} style={{ marginBottom: 8 }}>
//                 <strong>{a.title || a}</strong>
//                 {a.details && <div className="ls-muted">{a.details}</div>}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="ls-muted">No achievements yet</div>
//         )}
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function Achievements({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <section className="portfolio-section about-section-enhanced">
      <h2 className="about-title">Achievements</h2>
      <div className="about-underline"></div>

      {list.length ? (
        <div className="achievements-wrapper">
          {list.map((ach, i) => (
            <div className="achievement-card" key={ach.id ?? i} style={{ animationDelay: `${i * 75}ms` }}>
              <div className="achievement-dot" />
              <div className="achievement-header">
                <h3 className="achievement-item-title">{ach.title || ach.name || "Achievement"}</h3>
                <span className="achievement-date-badge">{ach.date || ach.year || ""}</span>
              </div>
              {ach.details || ach.description ? (
                <p className="achievement-description">{ach.details || ach.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="achievement-empty">No achievements to display.</p>
      )}
    </section>
  );
}
