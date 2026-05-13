import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext.jsx";

function Projects() {
  const { projects } = useContext(ResumeContext);

  return (
    <div className="theme-card p-3">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-400 text-sm">No projects added yet.</p>
      ) : (
        projects.map((proj, idx) => (
          <div key={idx} className="mb-3 text-gray-200 text-sm">
            <h5 className="text-gray-100 font-semibold">{proj.title}</h5>
            <small className="text-gray-400">{proj.timeline}</small>
            <p className="mt-1">{proj.description}</p>
            <p><strong className="text-gray-300">Tech Stack:</strong> {proj.techStack}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {proj.type}
            </span>
            {proj.type === "Group" && <p className="mt-1">Collaborators: {proj.collaborators}</p>}
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;
