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
  };

  const handleNext = () => {
    navigate("/output/heading");
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">

        <input className={inputClass} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        <input className={inputClass} name="contact" placeholder="Contact Info (Email, Phone)" value={formData.contact} onChange={handleChange} />
        <input className={inputClass} name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
        <input className={inputClass} name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} />
        <input className={inputClass} name="portfolio" placeholder="Portfolio Link" value={formData.portfolio} onChange={handleChange} />
        <input className={inputClass} name="title" placeholder="Professional Title" value={formData.title} onChange={handleChange} />
        <textarea className={inputClass} name="description" placeholder="Small description" value={formData.description} onChange={handleChange} rows={3} />

        <div className="flex gap-2">
          <button type="submit" className="theme-btn theme-btn-primary">Save Heading</button>
        </div>
      </form>

      <hr className="border-gray-700/50 my-4" />

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-100">Preview</h4>
        {!heading || Object.keys(heading).length === 0 ? (
          <p className="text-gray-400">No heading information added yet.</p>
        ) : (
          <ul className="space-y-2">
            <li className="theme-card p-3 flex justify-between items-start">
              <div className="text-gray-200 text-sm">
                <strong>{heading.name || heading.fullName}</strong> {heading.title && `| ${heading.title}`} <br />
                {heading.email && <span>Email: {heading.email} <br /></span>}
                {heading.website && <span>Portfolio: {heading.website} <br /></span>}
                {heading.summary && <p className="mb-0 mt-2">{heading.summary}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
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
                  }}>
                  Edit
                </button>
                <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                  onClick={() => {
                    setHeading({});
                    setFormData({ fullName: "", contact: "", linkedin: "", github: "", portfolio: "", title: "", description: "" });
                  }}>
                  Remove
                </button>
              </div>
            </li>
          </ul>
        )}

        <button className="theme-btn theme-btn-success" onClick={handleNext}>Save & Next</button>
      </div>
    </div>
  );
}

export default HeadingForm;
