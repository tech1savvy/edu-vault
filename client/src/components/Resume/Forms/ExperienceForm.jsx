import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext.js";

function ExperienceForm() {
  const { experiences, setExperiences } = useContext(ResumeContext);

  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    type: "Job",
    company: "",
    role: "",
    duration: "",
    details: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (editIndex !== null) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editIndex] = form;
      setExperiences(updatedExperiences);
      setEditIndex(null);
    } else {
      setExperiences([...experiences, form]);
    }
    setForm({ type: "Job", company: "", role: "", duration: "", details: "" });
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Type</label>
        <select className={inputClass} name="type" value={form.type} onChange={handleChange}>
          <option>Job</option>
          <option>Internship</option>
          <option>Volunteering</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Company / Organization</label>
        <input type="text" className={inputClass} name="company" value={form.company} onChange={handleChange} />
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <input type="text" className={inputClass} name="role" value={form.role} onChange={handleChange} />
      </div>

      <div>
        <label className={labelClass}>Duration</label>
        <input type="text" className={inputClass} name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. Jan 2024 - Jun 2024" />
      </div>

      <div>
        <label className={labelClass}>Details</label>
        <textarea className={inputClass} name="details" rows={3} value={form.details} onChange={handleChange} />
      </div>

      <div className="flex gap-2">
        <button className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"} onClick={handleAdd}>
          {editIndex !== null ? "Update Experience" : "Add Experience"}
        </button>
        {editIndex !== null && (
          <button className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
            setEditIndex(null);
            setForm({ type: "Job", company: "", role: "", duration: "", details: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      <hr className="border-gray-700/50 my-4" />

      <h4 className="text-base font-semibold text-gray-100">Preview</h4>
      {experiences.length === 0 && <p className="text-gray-400">No experiences added yet.</p>}
      <ul className="space-y-2">
        {experiences.map((exp, idx) => (
          <li key={idx} className="theme-card p-3 flex justify-between items-start">
            <div className="text-gray-200 text-sm">
              <strong>{exp.type}:</strong> {exp.role} at {exp.company} <br />
              <small className="text-gray-400">{exp.duration}</small>
              <p className="mb-0">{exp.details}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                onClick={() => { setForm(exp); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                Edit
              </button>
              <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExperienceForm;
