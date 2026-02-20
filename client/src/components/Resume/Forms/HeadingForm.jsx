import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";

function HeadingForm() {
  const { setHeadingData } = useContext(ResumeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    linkedin: "",
    github: "",
    portfolio: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHeadingData(formData); // save into context
    navigate("/output/heading"); // go to preview
  };

  return (
    <div className="form-container">
      {" "}
      <form onSubmit={handleSubmit} className="container mt-3">
        <h3 className="mb-3">Heading Information</h3>

        <input
          className="form-control mb-2"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="contact"
          placeholder="Contact Info (Email, Phone)"
          value={formData.contact}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="linkedin"
          placeholder="LinkedIn URL"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="github"
          placeholder="GitHub URL"
          value={formData.github}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="portfolio"
          placeholder="Portfolio Link"
          value={formData.portfolio}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="title"
          placeholder="Professional Title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="Small description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary">
          Save & Preview
        </button>
      </form>
    </div>
  );
}

export default HeadingForm;
