import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeContext } from "../../../context/resumeContext";
import { addEducation, updateEducation, deleteEducation } from "../../../services/api";

function EducationForm() {
  const { education = [], setEducation } = useContext(ResumeContext);
  const navigate = useNavigate();

  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    duration: "",
    details: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (formData.degree.trim() || formData.institution.trim()) {
      try {
        if (editIndex !== null) {
          const updated = await updateEducation(education[editIndex].id, formData);
          const updatedEducation = [...education];
          updatedEducation[editIndex] = updated;
          setEducation(updatedEducation);
          setEditIndex(null);
        } else {
          const created = await addEducation(formData);
          setEducation((prev) => [...prev, created]);
        }
        setFormData({ degree: "", institution: "", fieldOfStudy: "", duration: "", details: "", cgpa: "" });
      } catch (error) {
        console.error("Failed to save education:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEducation(id);
      setEducation(education.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  const handleNext = () => {
    navigate("/output/education");
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="space-y-3">
        <input className={inputClass} name="degree" placeholder="Degree/Program" value={formData.degree} onChange={handleChange} />
        <input className={inputClass} name="institution" placeholder="University/Institution" value={formData.institution} onChange={handleChange} />
        <input className={inputClass} name="fieldOfStudy" placeholder="Field of Study" value={formData.fieldOfStudy} onChange={handleChange} />
        <input className={inputClass} name="duration" placeholder="Duration (e.g. Jan 2020 - Jun 2024)" value={formData.duration} onChange={handleChange} />
        <input className={inputClass} name="details" placeholder="Details / Location" value={formData.details} onChange={handleChange} />
        <input className={inputClass} name="cgpa" placeholder="CGPA" value={formData.cgpa} onChange={handleChange} />

        <div className="flex gap-2">
          <button type="submit" className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"}>
            {editIndex !== null ? "Update Education" : "Add Education"}
          </button>
          {editIndex !== null && (
            <button type="button" className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
              setEditIndex(null);
              setFormData({ degree: "", institution: "", fieldOfStudy: "", duration: "", details: "", cgpa: "" });
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="border-gray-700/50 my-4" />

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-100">Preview</h4>
        {education.length === 0 && <p className="text-gray-400">No education added yet.</p>}
        <ul className="space-y-2">
          {education.map((edu, idx) => (
            <li key={idx} className="theme-card p-3 flex justify-between items-start">
              <div className="text-gray-200 text-sm">
                <strong>{edu.degree}</strong> at {edu.institution} <br />
                <small className="text-gray-400">{edu.duration}</small>
                {edu.fieldOfStudy && <p className="mb-0 text-gray-400">{edu.fieldOfStudy}</p>}
                {edu.details && <p className="mb-0 text-gray-400">{edu.details}</p>}
                {edu.cgpa && <p className="mb-0">CGPA: {edu.cgpa}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                  onClick={() => { setFormData(edu); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Edit
                </button>
                <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                  onClick={() => handleDelete(edu.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button className="theme-btn theme-btn-success" onClick={handleNext}>Save & Preview</button>
      </div>
    </div>
  );
}

export default EducationForm;
