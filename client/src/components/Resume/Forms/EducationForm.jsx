import { useState, useContext, useEffect } from "react";
import { ResumeContext } from "../../../context/resumeContext";
import { addEducation, updateEducation, deleteEducation } from "../../../services/api";

function EducationForm({ embedded = false }) {
  const { education, setEducation } = useContext(ResumeContext);

  const [form, setForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
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
        const updated = await updateEducation(editingId, form);
        setEducation(education.map((edu) => (edu.id === editingId ? updated : edu)));
        setEditingId(null);
      } else {
        const created = await addEducation(form);
        setEducation([...education, created]);
      }
      setForm({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        duration: "",
        details: "",
      });
    } catch (error) {
      console.error("Failed to save education:", error);
    }
  };

  const handleEdit = (edu) => {
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      duration: edu.duration,
      details: edu.details,
    });
    setEditingId(edu.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEducation(id);
      setEducation(education.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      duration: "",
      details: "",
    });
  };

  return (
    <div className={embedded ? "" : "container mt-3"}>
      {!embedded && <h3 className="mb-3">Education Section</h3>}

      <div className="card p-3 mb-4">
        <div className="mb-2">
          <label className="form-label">Institution / University</label>
          <input
            className="form-control"
            name="institution"
            value={form.institution}
            onChange={handleChange}
            placeholder="e.g. Stanford University"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Degree</label>
          <input
            className="form-control"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="e.g. Bachelor of Science"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Field of Study</label>
          <input
            className="form-control"
            name="fieldOfStudy"
            value={form.fieldOfStudy}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Duration</label>
          <input
            className="form-control"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 2020 - 2024"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Details / Achievements</label>
          <textarea
            className="form-control"
            name="details"
            rows="3"
            value={form.details}
            onChange={handleChange}
            placeholder="GPA, relevant coursework, etc."
          />
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {editingId ? "Update Education" : "Add Education"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {!embedded && <hr />}

      {!embedded && <h4>Saved Education</h4>}
      {embedded && <h4 className="mb-3 mt-4">Saved education</h4>}
      {education.length === 0 && <p className="text-muted">No education records found.</p>}
      <div className="list-group">
        {education.map((edu) => (
          <div key={edu.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{edu.degree} in {edu.fieldOfStudy}</h5>
              <small>{edu.duration}</small>
            </div>
            <p className="mb-1">{edu.institution}</p>
            <small className="text-muted">{edu.details}</small>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(edu)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(edu.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationForm;
