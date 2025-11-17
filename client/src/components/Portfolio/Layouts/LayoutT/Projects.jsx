// import React from 'react';
//
// const Projects = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Projects</h2>
//       {data && data.length > 0 ? (
//         <div className="projects-grid">
//           {data.map((project) => (
//             <div key={project.id} className="project-card">
//               <h3>{project.title}</h3>
//               <p>{project.description}</p>
//               <p><strong>Tech Stack:</strong> {project.techStack}</p>
//               <p><strong>Timeline:</strong> {project.timeline}</p>
//               <span className="badge">{project.type}</span>
//               {project.collaborators && <p><strong>Collaborators:</strong> {project.collaborators}</p>}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No projects to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Projects;

import React from "react";

const Projects = ({ data }) => {
  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Reuse generic header styles */}
      <h2 className="about-title">Projects</h2>
      <div className="about-underline"></div>

      {data && data.length > 0 ? (
        <div className="projects-grid-enhanced">
          {data.map((project, index) => (
            <div
              key={project.id}
              className="project-card-enhanced"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Glow Blob (Top Right) */}
              <div className="project-card-glow"></div>

              <div className="project-card-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>

                  <span className="project-type-badge">{project.type}</span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-meta-stack">
                  {/* Tech Stack */}
                  <div className="project-meta-row">
                    <svg
                      className="project-icon icon-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <p className="project-meta-text">
                      <span className="meta-label label-primary">
                        Tech Stack:
                      </span>{" "}
                      {project.techStack}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="project-meta-row">
                    <svg
                      className="project-icon icon-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="project-meta-text">
                      <span className="meta-label label-secondary">
                        Timeline:
                      </span>{" "}
                      {project.timeline}
                    </p>
                  </div>

                  {/* Collaborators (Optional) */}
                  {project.collaborators && (
                    <div className="project-meta-row">
                      <svg
                        className="project-icon icon-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="project-meta-text">
                        <span className="meta-label label-primary">
                          Collaborators:
                        </span>{" "}
                        {project.collaborators}
                      </p>
                    </div>
                  )}
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
};

export default Projects;
