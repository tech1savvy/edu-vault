import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function EducationForm() {
  const { education, setEducation } = useContext(ResumeContext);

  const [formData, setFormData] = useState({
    degree: "",
    college: "",
    location: "",
    startDate: "",
    endDate: "",
    score: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (formData.degree.trim() && formData.college.trim()) {
      setEducation([...education, formData]);
      setFormData({
        degree: "",
        college: "",
        location: "",
        startDate: "",
        endDate: "",
        score: "",
      });
    }
  };

  const handleRemove = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Education Section</h2>
      <p className="text-muted">Add your educational qualifications</p>

      <div className="mb-3">
        <label className="form-label">Degree/Program*</label>
        <input
          className="form-control mb-2"
          name="degree"
          placeholder="Degree/Program"
          value={formData.degree}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">University/College*</label>
        <input
          className="form-control mb-2"
          name="college"
          placeholder="University/College"
          value={formData.college}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              className="form-control mb-2"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              className="form-control mb-2"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Marks/Percentage/GPA</label>
        <input
          className="form-control mb-2"
          name="score"
          placeholder="Marks/Percentage/GPA"
          value={formData.score}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Education
      </button>

      <hr />

      <h4>Preview</h4>
      {education.length === 0 && <p>No education added yet.</p>}
      <ul className="list-group">
        {education.map((edu, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{edu.degree}</strong>
                <p>{edu.college}, {edu.location}</p>
                <p>{edu.startDate} - {edu.endDate || "Present"}</p>
                <p>Score: {edu.score}</p>
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

export default EducationForm;
