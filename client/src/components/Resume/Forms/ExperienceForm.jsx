import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function ExperienceForm() {
  const { experiences, setExperiences } = useContext(ResumeContext);

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
    setExperiences([...experiences, form]);
    setForm({
      type: "Job",
      company: "",
      role: "",
      duration: "",
      details: "",
    });
  };

  const handleRemove = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Experience Section</h2>

      {/* form fields (same as before) */}
      <div className="mb-3">
        <label className="form-label">Type</label>
        <select
          className="form-select"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option>Job</option>
          <option>Internship</option>
          <option>Volunteering</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Company / Organization</label>
        <input
          type="text"
          className="form-control"
          name="company"
          value={form.company}
          onChange={handleChange}
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
        />
      </div>

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Experience
      </button>

      <hr />

      <h4>Preview</h4>
      {experiences.length === 0 && <p>No experiences added yet.</p>}
      <ul className="list-group">
        {experiences.map((exp, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{exp.type}:</strong> {exp.role} at {exp.company} <br />
                <small>{exp.duration}</small>
                <p>{exp.details}</p>
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemove(idx)}
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

export default ExperienceForm;
