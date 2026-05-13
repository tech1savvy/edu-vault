import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext.jsx";

function Experience() {
  const { experiences } = useContext(ResumeContext);

  return (
    <div className="theme-card p-3">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Experience</h2>
      {experiences.length === 0 ? (
        <p className="text-gray-400 text-sm">No experiences added yet.</p>
      ) : (
        experiences.map((exp, idx) => (
          <div key={idx} className="mb-3 text-gray-200 text-sm">
            <h5 className="text-gray-100 font-semibold">{exp.role} - {exp.company}</h5>
            <small className="text-gray-400">{exp.duration}</small>
            <p className="mt-1">{exp.details}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
              {exp.type}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Experience;
