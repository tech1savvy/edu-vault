import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";
import { addExperience, updateExperience, deleteExperience } from "../../../services/api";

function ExperienceForm({ embedded = false }) {
  const { experiences, setExperiences } = useContext(ResumeContext);

  const [form, setForm] = useState({
    company: "",
    role: "",
    duration: "",
    details: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const updated = await updateExperience(editingId, form);
        setExperiences(experiences.map((exp) => (exp.id === editingId ? updated : exp)));
        setEditingId(null);
      } else {
        const created = await addExperience(form);
        setExperiences([...experiences, created]);
      }
      setForm({
        company: "",
        role: "",
        duration: "",
        details: "",
      });
    } catch (error) {
      console.error("Failed to save experience:", error);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      details: exp.details,
    });
    setEditingId(exp.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      company: "",
      role: "",
      duration: "",
      details: "",
    });
  };

  return (
    <div className={embedded ? "" : "container mt-3"}>
      {!embedded && <h3 className="mb-3">Experience Section</h3>}

      <div className="card p-3 mb-4">
        <div className="mb-3">
          <label className="form-label">Company / Organization</label>
          <input
            type="text"
            className="form-control"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Google"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration</label>
          <input
            type="text"
            className="form-control"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. Jan 2024 - Jun 2024"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Details</label>
          <textarea
            className="form-control"
            name="details"
            rows="3"
            value={form.details}
            onChange={handleChange}
            placeholder="Key responsibilities and achievements"
          />
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {!embedded && <hr />}

      {!embedded && <h4>Saved Experiences</h4>}
      {embedded && <h4 className="mb-3 mt-4">Saved experience</h4>}
      {experiences.length === 0 && <p className="text-muted">No experiences found.</p>}
      <div className="list-group">
        {experiences.map((exp) => (
          <div key={exp.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{exp.role}</h5>
              <small>{exp.duration}</small>
            </div>
            <p className="mb-1">{exp.company}</p>
            <small className="text-muted">{exp.details}</small>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(exp)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceForm;
