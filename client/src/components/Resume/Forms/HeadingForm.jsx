import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";

function HeadingForm() {
  const { heading, setHeading } = useContext(ResumeContext);
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

    setHeading({
      name: formData.fullName,
      email: formData.contact,
      contact: formData.contact,
      linkedin: formData.linkedin,
      github: formData.github,
      website: formData.portfolio,
      title: formData.title,
      summary: formData.description,
    });
    // Removed auto navigation to output/heading
  };

  const handleNext = () => {
    navigate("/output/heading");
  };

  return (
    <div className="form-container">
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

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Save Heading
          </button>
        </div>
      </form>

      <hr />

      <div className="container mt-3">
        <h4>Preview</h4>
        {!heading || Object.keys(heading).length === 0 ? (
          <p>No heading information added yet.</p>
        ) : (
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <strong>{heading.name || heading.fullName}</strong> {heading.title && `| ${heading.title}`} <br />
                {heading.email && <span>Email: {heading.email} <br /></span>}
                {heading.website && <span>Portfolio: {heading.website} <br /></span>}
                {heading.summary && <p className="mb-0 mt-2">{heading.summary}</p>}
              </div>
              <div className="d-flex flex-column gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => {
                    setFormData({
                      fullName: heading.name || heading.fullName || "",
                      contact: heading.contact || heading.email || "",
                      linkedin: heading.linkedin || "",
                      github: heading.github || "",
                      portfolio: heading.website || heading.portfolio || "",
                      title: heading.title || "",
                      description: heading.summary || heading.description || "",
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={() => {
                    setHeading({});
                    setFormData({
                      fullName: "",
                      contact: "",
                      linkedin: "",
                      github: "",
                      portfolio: "",
                      title: "",
                      description: "",
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>
        )}

        <button className="btn btn-success" onClick={handleNext}>
          Save & Next
        </button>
      </div>
    </div>
  );
}

export default HeadingForm;
