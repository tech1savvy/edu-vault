import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";

function EducationForm() {
  const { education = [], setEducation } = useContext(ResumeContext);
  const navigate = useNavigate();

  const [editIndex, setEditIndex] = useState(null);

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

  const handleAdd = (e) => {
    e.preventDefault();
    if (formData.degree.trim() || formData.college.trim()) {
      if (editIndex !== null) {
        const updatedEducation = [...education];
        updatedEducation[editIndex] = formData;
        setEducation(updatedEducation);
        setEditIndex(null);
      } else {
        setEducation((prev) => [...prev, formData]);
      }
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

  const handleNext = () => {
    navigate("/output/education");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleAdd} className="container mt-3">
        <h3 className="mb-3">Education</h3>

        <input
          className="form-control mb-2"
          name="degree"
          placeholder="Degree/Program"
          value={formData.degree}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="college"
          placeholder="University/College"
          value={formData.college}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="score"
          placeholder="Marks/Percentage/GPA"
          value={formData.score}
          onChange={handleChange}
        />

        <div className="d-flex gap-2">
          <button type="submit" className={editIndex !== null ? "btn btn-success" : "btn btn-primary"} onClick={handleAdd}>
            {editIndex !== null ? "Update Education" : "Add Education"}
          </button>
          {editIndex !== null && (
            <button type="button" className="btn btn-secondary" onClick={() => {
              setEditIndex(null);
              setFormData({ degree: "", college: "", location: "", startDate: "", endDate: "", score: "" });
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <div className="container mt-3">
        <h4>Preview</h4>
        {education.length === 0 && <p>No education added yet.</p>}
        <ul className="list-group mb-3">
          {education.map((edu, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <strong>{edu.degree}</strong> at {edu.college} <br />
                <small>{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}</small>
                {edu.location && <p className="mb-0 text-muted">{edu.location}</p>}
                {edu.score && <p className="mb-0">Score: {edu.score}</p>}
              </div>
              <div className="d-flex flex-column gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => {
                    setFormData(edu);
                    setEditIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button className="btn btn-success" onClick={handleNext}>
          Save & Preview
        </button>
      </div>
    </div>
  );
}

export default EducationForm;
