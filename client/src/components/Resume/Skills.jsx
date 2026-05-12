import React, { useContext, useState } from "react";
import { ResumeContext } from "../../context/resumeContext";
import { addSkill, deleteSkill } from "../../services/api";

const Skills = ({ isInput = false, embedded = false }) => {
  const { skills, setSkills } = useContext(ResumeContext);
  const [newSkill, setNewSkill] = useState("");
  const [level, setLevel] = useState("Intermediate");

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const created = await addSkill({ name: newSkill.trim(), level });
      setSkills([...skills, created]);
      setNewSkill("");
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  return (
    <div className={embedded ? "" : "container mt-4"}>
      {isInput && (
        <div className="card p-3 mb-4">
          {!embedded && (
            <>
              <h2>Skills Section</h2>
              <p className="text-muted">
                Add your skills, programming languages, and tools expertise below.
              </p>
            </>
          )}

          <div className="d-flex flex-wrap gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill"
              className="form-control"
            />
            <select
              className={`form-select ${embedded ? "w-auto min-w-[8rem]" : "w-25"}`}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button onClick={handleAddSkill} className="btn btn-primary">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Preview / Output */}
      {skills.length > 0 ? (
        <div className="mt-3">
          <h4>{embedded ? "Your skills" : "Your Skills"}</h4>
          <div className="d-flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="badge bg-secondary p-2 d-flex align-items-center gap-2"
                style={{ fontSize: "1rem" }}
              >
                <span>
                  {skill.name} <small>({skill.level})</small>
                </span>
                {isInput && (
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="btn btn-close btn-close-white"
                    style={{ fontSize: "0.6rem" }}
                    aria-label="Remove"
                  ></button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted mt-3">
          {isInput ? "No skills added yet." : "No skills to display."}
        </p>
      )}
    </div>
  );
};

export default Skills;
