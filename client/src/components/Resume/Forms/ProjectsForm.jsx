import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";
import { addProject, updateProject, deleteProject } from "../../../services/api";

function ProjectsForm({ embedded = false }) {
  const { projects, setProjects } = useContext(ResumeContext);

  const [form, setForm] = useState({
    title: "",
    type: "Personal",
    description: "",
    techStack: "",
    timeline: "",
    collaborators: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const updated = await updateProject(editingId, form);
        setProjects(projects.map((p) => (p.id === editingId ? updated : p)));
        setEditingId(null);
      } else {
        const created = await addProject(form);
        setProjects([...projects, created]);
      }
      setForm({
        title: "",
        type: "Personal",
        description: "",
        techStack: "",
        timeline: "",
        collaborators: "",
      });
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      type: p.type || "Personal",
      description: p.description || "",
      techStack: p.techStack || "",
      timeline: p.timeline || "",
      collaborators: p.collaborators || "",
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      type: "Personal",
      description: "",
      techStack: "",
      timeline: "",
      collaborators: "",
    });
  };

  return (
    <div className={embedded ? "" : "container mt-3"}>
      {!embedded && <h3 className="mb-3">Projects Section</h3>}

      <div className="card p-3 mb-4">
        <div className="mb-3">
          <label className="form-label">Project Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. EduVault"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Personal">Personal</option>
            <option value="Academic">Academic</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Briefly describe the project"
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
            placeholder="e.g. React, Node.js, PostgreSQL"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Link / timeline</label>
          <input
            type="text"
            className="form-control"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder="e.g. GitHub URL or project dates"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Collaborators (optional)</label>
          <input
            type="text"
            className="form-control"
            name="collaborators"
            value={form.collaborators}
            onChange={handleChange}
            placeholder="Names or team"
          />
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {!embedded && <hr />}

      {!embedded && <h4>Saved Projects</h4>}
      {embedded && <h4 className="mb-3 mt-4">Saved projects</h4>}
      {projects.length === 0 && <p className="text-muted">No projects found.</p>}
      <div className="list-group">
        {projects.map((p) => (
          <div key={p.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{p.title}</h5>
              <span className="badge bg-info text-dark">{p.type}</span>
            </div>
            <p className="mb-1">{p.description}</p>
            <small className="text-muted">Tech: {p.techStack}</small>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsForm;
