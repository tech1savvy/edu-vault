import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";
import { AuthContext } from "../../../context/AuthContext";
import { createOrUpdateHeading } from "../../../services/api";

function HeadingForm() {
  const { heading, setHeading } = useContext(ResumeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    link: "",
    description: "",
  });

  useEffect(() => {
    const h = heading && typeof heading === "object" ? heading : {};
    setFormData({
      name: h.name || user?.name || "",
      role: h.role || "",
      email: h.email || user?.email || "",
      phone: h.phone || "",
      location: h.location || "",
      link: h.link || "",
      description: h.description || "",
    });
  }, [heading, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedHeading = await createOrUpdateHeading(formData);
      setHeading(updatedHeading); // save into context
      navigate("/output/heading"); // go to preview
    } catch (error) {
      console.error("Failed to save heading:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="container mt-3">
        <h3 className="mb-3">Heading Information</h3>

        <div className="mb-2">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Professional Role</label>
          <input
            className="form-control"
            name="role"
            placeholder="e.g. Full Stack Developer"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            name="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Personal Link (Portfolio/LinkedIn)</label>
          <input
            className="form-control"
            name="link"
            placeholder="URL"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">About Me / Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            placeholder="A brief introduction about yourself"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Save & Preview
        </button>
      </form>
    </div>
  );
}

export default HeadingForm;
