import React, { useContext, useState } from "react";
import SkillsForm from "./Forms/SkillsForm";
import { ResumeContext } from "../../context/resumeContext";

const Skills = ({ isInput = false }) => {
  const { skills, setSkills } = useContext(ResumeContext);
  const [editIndex, setEditIndex] = useState(null);

  const addSkill = (skill) => {
    if (editIndex !== null) {
      const updatedSkills = [...skills];
      updatedSkills[editIndex] = skill;
      setSkills(updatedSkills);
      setEditIndex(null);
    } else {
      setSkills([...skills, skill]);
    }
  };
  
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
          <SkillsForm 
            onAddSkill={addSkill} 
            initialValue={editIndex !== null ? skills[editIndex] : ""} 
            isEditing={editIndex !== null}
            onCancel={() => setEditIndex(null)}
          />
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
                <div className="d-flex gap-2">
                  <button
                    onClick={() => {
                      setEditIndex(index);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeSkill(index)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
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
