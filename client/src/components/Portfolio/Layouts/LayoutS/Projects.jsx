// import React from "react";

// export default function Projects({ data = [] }) {
//   return (
//     <div>
//       <h2>Projects</h2>
//       <div className="ls-underline" />
//       <div style={{ marginTop: 12 }}>
//         {data.length ? (
//           <div className="ls-two-col">
//             {data.map((p, i) => (
//               <div key={i} className="ls-item">
//                 <div style={{ fontWeight: 800 }}>{p.title}</div>
//                 <div className="ls-muted" style={{ marginTop:6 }}>{p.techStack && p.techStack.join(", ")}</div>
//                 {p.description && <p style={{ marginTop:8 }}>{p.description}</p>}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="ls-muted">No projects to display.</div>
//         )}
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function Projects({ data = [] }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <section className="portfolio-section about-section-enhanced">
      <h2 className="about-title">Projects</h2>
      <div className="about-underline"></div>

      {list.length ? (
        <div className="projects-grid-enhanced">
          {list.map((project, i) => (
            <div className="project-card-enhanced" key={project.id ?? i} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="project-card-glow" />
              <div className="project-card-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  {project.type && <span className="project-type-badge">{project.type}</span>}
                </div>

                {project.description && <p className="project-description">{project.description}</p>}

                <div className="project-meta-stack">
                  {project.techStack && <p className="project-meta-text"><strong>Tech:</strong> {Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack}</p>}
                  {project.timeline && <p className="project-meta-text"><strong>Timeline:</strong> {project.timeline}</p>}
                  {project.collaborators && <p className="project-meta-text"><strong>Collaborators:</strong> {project.collaborators}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="achievement-empty">No projects to display.</p>
      )}
    </section>
  );
}
