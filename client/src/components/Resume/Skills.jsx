import React, { useState } from "react";
import SkillsForm from "./Forms/SkillsForm";

const Skills = ({ isInput = false }) => {
  const [skills, setSkills] = useState([]);

  const addSkill = (skill) => setSkills([...skills, skill]);
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

  return (
    <div className="container mt-4">
      {isInput && (
        <>
          {/* Title and Instructions */}
          <h2>Skills Section</h2>
          <p className="text-muted">
            Add your skills, programming languages, and tools expertise below.
          </p>

          {/* Input Form */}
          <SkillsForm onAddSkill={addSkill} />
        </>
      )}

      {/* Preview / Output */}
      {skills.length > 0 ? (
        <ul className="list-group mt-3">
          {skills.map((skill, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {skill}
              {isInput && (
                <button
                  onClick={() => removeSkill(index)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mt-3">
          {isInput ? "No skills added yet." : "No skills to display."}
        </p>
      )}
    </div>
  );
};

export default Skills;
