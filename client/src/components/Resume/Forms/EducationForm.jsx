import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";

function EducationForm() {
  const { educationData, setEducationData } = useContext(ResumeContext);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setEducationData([...educationData, formData]);
    navigate("/output/education");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="container mt-3">
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

        <button type="submit" className="btn btn-success">
          Save & Preview
        </button>
      </form>
    </div>
  );
}

export default EducationForm;
