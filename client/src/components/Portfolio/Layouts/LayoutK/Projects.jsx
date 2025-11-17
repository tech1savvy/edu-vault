import React from 'react';

const Projects = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Projects</h2>
      {data && data.length > 0 ? (
        <div className="projects-grid">
          {data.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p><strong>Tech Stack:</strong> {project.techStack}</p>
              <p><strong>Timeline:</strong> {project.timeline}</p>
              <span className="badge">{project.type}</span>
              {project.collaborators && <p><strong>Collaborators:</strong> {project.collaborators}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No projects to display.</p>
      )}
    </section>
  );
};

export default Projects;
