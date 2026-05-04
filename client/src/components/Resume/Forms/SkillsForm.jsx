import React, { useState, useEffect } from "react";

const SkillsForm = ({ onAddSkill, initialValue = "", isEditing = false, onCancel }) => {
  const [input, setInput] = useState(initialValue);

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddSkill(input.trim());
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="mb-4 d-flex flex-column gap-2">
      <div className="d-flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a skill and press Enter"
          className="form-control"
        />
        <button onClick={handleAdd} className={isEditing ? "btn btn-success" : "btn btn-primary"}>
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
      {isEditing && (
        <button onClick={onCancel} className="btn btn-secondary align-self-start mt-1">
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default SkillsForm;
