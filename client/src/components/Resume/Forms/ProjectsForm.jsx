import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

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
    setForm({
      title: "",
      description: "",
      techStack: "",
      timeline: "",
      type: "Individual",
      collaborators: "",
    });
  };

  return (
    <div className="container">
      <h2 className="mb-3">Projects Section</h2>

      {/* inputs same as before */}
      <div className="mb-3">
        <label className="form-label">Project Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tech Stack</label>
        <input
          type="text"
          className="form-control"
          name="techStack"
          value={form.techStack}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Timeline</label>
        <input
          type="text"
          className="form-control"
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          placeholder="e.g. 3 months (Jan - Mar 2024)"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Project Type</label>
        <select
          className="form-select"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option>Individual</option>
          <option>Group</option>
        </select>
      </div>

      {form.type === "Group" && (
        <div className="mb-3">
          <label className="form-label">Collaborators</label>
          <input
            type="text"
            className="form-control"
            name="collaborators"
            value={form.collaborators}
            onChange={handleChange}
            placeholder="Comma-separated names"
          />
        </div>
      )}

      <div className="d-flex gap-2">
        <button className={editIndex !== null ? "btn btn-success" : "btn btn-primary"} onClick={handleAdd}>
          {editIndex !== null ? "Update Project" : "Add Project"}
        </button>
        {editIndex !== null && (
          <button className="btn btn-secondary" onClick={() => {
            setEditIndex(null);
            setForm({ title: "", description: "", techStack: "", timeline: "", type: "Individual", collaborators: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      <hr />

      <h4>Preview</h4>
      {projects.length === 0 && <p>No projects added yet.</p>}
      <ul className="list-group">
        {projects.map((proj, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{proj.title}</strong> <br />
              <small>{proj.timeline}</small>
              <p className="mb-1">{proj.description}</p>
              <em>{proj.techStack}</em> <br />
              <span className="badge bg-info">{proj.type}</span>
              {proj.type === "Group" && (
                <p className="mb-0 mt-1">Collaborators: {proj.collaborators}</p>
              )}
            </div>
            <div className="d-flex flex-column gap-2">
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={() => {
                  setForm(proj);
                  setEditIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Edit
              </button>
              <button 
                className="btn btn-outline-danger btn-sm" 
                onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
              >
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
