// import React from "react";

// export default function Skills({ data = [] }) {
//   return (
//     <div>
//       <h2>Skills</h2>
//       <div className="ls-underline" />
//       <div style={{ marginTop: 12 }}>
//         {data.length ? (
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             {data.map((s, i) => (
//               <div key={i} style={{
//                 background: "rgba(255,255,255,0.02)",
//                 padding: "8px 12px",
//                 borderRadius: 999,
//                 border: "1px solid rgba(255,255,255,0.02)",
//                 fontWeight: 600,
//                 color: "var(--title-color)"
//               }}>{s.name || s}</div>
//             ))}
//           </div>
//         ) : (
//           <div className="ls-muted">No skills to display.</div>
//         )}
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function Skills({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  const getSkillVariant = (level = "") => {
    const lower = (level || "").toLowerCase();
    if (lower.includes("expert") || lower.includes("advanced")) return "skill-variant-primary";
    if (lower.includes("intermediate")) return "skill-variant-secondary";
    return "skill-variant-default";
  };

  return (
    <section className="portfolio-section about-section-enhanced">
      <h2 className="about-title">Skills</h2>
      <div className="about-underline"></div>

      {list.length ? (
        <div className="skills-flex-container">
          {list.map((s, i) => {
            const name = typeof s === "string" ? s : s.name || s.skill || "";
            const level = typeof s === "string" ? "" : s.level || s.levelName || "";
            return (
              <div key={s.id ?? i} className={`skill-pill ${getSkillVariant(level)}`} style={{ animationDelay: `${i * 40}ms` }}>
                <div className="skill-pill-bg" />
                <div className="skill-content">
                  <span className="skill-name">{name}</span>
                  {level && <span className="skill-level-badge">{level}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="achievement-empty">No skills to display.</p>
      )}
    </section>
  );
}
