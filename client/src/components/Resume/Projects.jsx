import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Projects() {
  const { projects } = useContext(ResumeContext);

  return (
    <div className="container">
      <h2 className="mb-3">Projects</h2>
      {projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        projects.map((proj, idx) => (
          <div key={idx} className="mb-3">
            <h5>{proj.title}</h5>
            <small>{proj.timeline}</small>
            <p>{proj.description}</p>
            <p>
              <strong>Tech Stack:</strong> {proj.techStack}
            </p>
            <span className="badge bg-info">{proj.type}</span>
            {proj.type === "Group" && (
              <p>Collaborators: {proj.collaborators}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;
