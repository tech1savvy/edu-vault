import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Skills() {
  const { skills } = useContext(ResumeContext);

  return (
    <div className="container">
      <h2 className="mb-3">Skills</h2>
      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <ul className="list-unstyled">
          {skills.map((skill, idx) => (
            <li key={idx} className="mb-3">
              <strong className="d-block">{skill.name}</strong>
              {skill.level && (
                <span className="text-muted">{skill.level}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Skills;
