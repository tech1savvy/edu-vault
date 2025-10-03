import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function ProjectsForm() {
  const { projects, setProjects } = useContext(ResumeContext);

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
    setProjects([...projects, form]);
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

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Project
      </button>

      <hr />

      <h4>Preview</h4>
      {projects.length === 0 && <p>No projects added yet.</p>}
      <ul className="list-group">
        {projects.map((proj, idx) => (
          <li key={idx} className="list-group-item">
            <strong>{proj.title}</strong> <br />
            <small>{proj.timeline}</small>
            <p>{proj.description}</p>
            <em>{proj.techStack}</em> <br />
            <span className="badge bg-info">{proj.type}</span>
            {proj.type === "Group" && (
              <p>Collaborators: {proj.collaborators}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsForm;
