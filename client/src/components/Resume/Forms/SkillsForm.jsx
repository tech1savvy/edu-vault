import React, { useState } from "react";

const SkillsForm = ({ onAddSkill }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAddSkill(input.trim());
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="mb-4 d-flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a skill and press Enter"
        className="form-control"
      />
      <button onClick={handleAdd} className="btn btn-primary">
        Add
      </button>
    </div>
  );
};

export default SkillsForm;
