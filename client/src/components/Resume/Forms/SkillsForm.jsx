import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function SkillsForm() {
  const { skills, setSkills } = useContext(ResumeContext);

  const [form, setForm] = useState({
    name: "",
    level: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.name.trim()) {
      setSkills([...skills, form]);
      setForm({
        name: "",
        level: "",
      });
    }
  };

  const handleRemove = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Skills Section</h2>
      <p className="text-muted">Add your skills, programming languages, and tools expertise</p>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Skill Name*</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., JavaScript"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Skill Level</label>
            <input
              type="text"
              className="form-control"
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="e.g., Expert"
            />
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Skill
      </button>

      <hr />

      <h4>Preview</h4>
      {skills.length === 0 && <p>No skills added yet.</p>}
      <ul className="list-group">
        {skills.map((skill, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{skill.name}</strong>
                {skill.level && (
                  <span className="text-muted"> | {skill.level}</span>
                )}
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

export default SkillsForm;
