import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext.jsx";

function ProjectsForm() {
  const { projects, setProjects } = useContext(ResumeContext);

  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    timeline: "",
    type: "Individual",
    collaborators: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (editIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = form;
      setProjects(updatedProjects);
      setEditIndex(null);
    } else {
      setProjects([...projects, form]);
    }
    setForm({ title: "", description: "", techStack: "", timeline: "", type: "Individual", collaborators: "" });
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Project Title</label>
        <input type="text" className={inputClass} name="title" value={form.title} onChange={handleChange} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea className={inputClass} name="description" rows={3} value={form.description} onChange={handleChange} />
      </div>

      <div>
        <label className={labelClass}>Tech Stack</label>
        <input type="text" className={inputClass} name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
      </div>

      <div>
        <label className={labelClass}>Timeline</label>
        <input type="text" className={inputClass} name="timeline" value={form.timeline} onChange={handleChange} placeholder="e.g. 3 months (Jan - Mar 2024)" />
      </div>

      <div>
        <label className={labelClass}>Project Type</label>
        <select className={inputClass} name="type" value={form.type} onChange={handleChange}>
          <option>Individual</option>
          <option>Group</option>
        </select>
      </div>

      {form.type === "Group" && (
        <div>
          <label className={labelClass}>Collaborators</label>
          <input type="text" className={inputClass} name="collaborators" value={form.collaborators} onChange={handleChange} placeholder="Comma-separated names" />
        </div>
      )}

      <div className="flex gap-2">
        <button className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"} onClick={handleAdd}>
          {editIndex !== null ? "Update Project" : "Add Project"}
        </button>
        {editIndex !== null && (
          <button className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
            setEditIndex(null);
            setForm({ title: "", description: "", techStack: "", timeline: "", type: "Individual", collaborators: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      <hr className="border-gray-700/50 my-4" />

      <h4 className="text-base font-semibold text-gray-100">Preview</h4>
      {projects.length === 0 && <p className="text-gray-400">No projects added yet.</p>}
      <ul className="space-y-2">
        {projects.map((proj, idx) => (
          <li key={idx} className="theme-card p-3 flex justify-between items-start">
            <div className="text-gray-200 text-sm">
              <strong>{proj.title}</strong> <br />
              <small className="text-gray-400">{proj.timeline}</small>
              <p className="mb-1">{proj.description}</p>
              <em className="text-gray-400">{proj.techStack}</em> <br />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 mt-1">{proj.type}</span>
              {proj.type === "Group" && <p className="mb-0 mt-1">Collaborators: {proj.collaborators}</p>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                onClick={() => { setForm(proj); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                Edit
              </button>
              <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                onClick={() => setProjects(projects.filter((_, i) => i !== idx))}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsForm;
