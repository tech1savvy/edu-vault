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

  const inputClass = "bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";

  return (
    <div className={embedded ? "" : "mt-4"}>
      {isInput && (
        <div className="theme-card p-3 mb-4">
          {!embedded && (
            <>
              <h2 className="text-lg font-semibold text-gray-100">Skills Section</h2>
              <p className="text-gray-400 text-sm">Add your skills, programming languages, and tools expertise below.</p>
            </>
          )}

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill"
              className={inputClass + " flex-1"}
            />
            <select
              className={inputClass + " " + (embedded ? "w-auto min-w-[8rem]" : "w-1/4")}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button onClick={handleAddSkill} className="theme-btn theme-btn-primary">Add</button>
          </div>
        </div>
      )}

      {skills.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-base font-semibold text-gray-100">{embedded ? "Your skills" : "Your Skills"}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-gray-500/20 text-gray-200 border border-gray-500/30"
              >
                <span>{skill.name} <small className="text-gray-400">({skill.level})</small></span>
                {isInput && (
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="w-4 h-4 rounded-full bg-gray-600 hover:bg-red-500 flex items-center justify-center text-white text-[0.5rem] leading-none transition-colors"
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-3 text-sm">
          {isInput ? "No skills added yet." : "No skills to display."}
        </p>
      )}
    </div>
  );
};

export default Skills;
