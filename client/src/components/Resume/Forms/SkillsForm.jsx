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

  const inputClass = "flex-1 bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a skill and press Enter"
          className={inputClass}
        />
        <button onClick={handleAdd} className={isEditing ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"}>
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
      {isEditing && (
        <button onClick={onCancel} className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700 self-start mt-1">
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default SkillsForm;
