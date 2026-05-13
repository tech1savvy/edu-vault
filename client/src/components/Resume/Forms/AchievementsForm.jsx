import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function AchievementsForm() {
  const { achievements, setAchievements } = useContext(ResumeContext);

  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.title.trim()) {
      if (editIndex !== null) {
        const updatedAchievements = [...achievements];
        updatedAchievements[editIndex] = form;
        setAchievements(updatedAchievements);
        setEditIndex(null);
      } else {
        setAchievements([...achievements, form]);
      }
      setForm({ title: "", description: "", date: "" });
    }
  };

  const handleRemove = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Achievement Title*</label>
        <input type="text" className={inputClass} name="title" value={form.title} onChange={handleChange} placeholder="e.g., 5-Star C++ Programmer on HackerRank" />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea className={inputClass} name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief description of the achievement..." />
      </div>

      <div>
        <label className={labelClass}>Date/Awarded</label>
        <input type="text" className={inputClass} name="date" value={form.date} onChange={handleChange} placeholder="e.g., 2024, Smart India Hackathon 2024" />
      </div>

      <div className="flex gap-2">
        <button className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"} onClick={handleAdd}>
          {editIndex !== null ? "Update Achievement" : "Add Achievement"}
        </button>
        {editIndex !== null && (
          <button className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
            setEditIndex(null);
            setForm({ title: "", description: "", date: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      <hr className="border-gray-700/50 my-4" />

      <h4 className="text-base font-semibold text-gray-100">Preview</h4>
      {achievements.length === 0 && <p className="text-gray-400">No achievements added yet.</p>}
      <ul className="space-y-2">
        {achievements.map((achievement, idx) => (
          <li key={idx} className="theme-card p-3">
            <div className="flex justify-between items-start">
              <div className="text-gray-200 text-sm">
                <strong>{achievement.title}</strong>
                {achievement.description && <p className="mb-1 mt-1">{achievement.description}</p>}
                {achievement.date && <small className="text-gray-400">{achievement.date}</small>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                  onClick={() => { setForm(achievement); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Edit
                </button>
                <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                  onClick={() => handleRemove(idx)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AchievementsForm;
