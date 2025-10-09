import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Experience() {
  const { experiences } = useContext(ResumeContext);

  return (
    <div className="container">
      <h2 className="mb-3">Experience</h2>
      {experiences.length === 0 ? (
        <p>No experiences added yet.</p>
      ) : (
        experiences.map((exp, idx) => (
          <div key={idx} className="mb-3">
            <h5>
              {exp.role} - {exp.company}
            </h5>
            <small>{exp.duration}</small>
            <p>{exp.details}</p>
            <span className="badge bg-secondary">{exp.type}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Experience;
