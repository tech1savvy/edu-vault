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
      setFormData({ degree: "", college: "", location: "", startDate: "", endDate: "", score: "" });
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
        <input className={inputClass} name="college" placeholder="University/College" value={formData.college} onChange={handleChange} />
        <input className={inputClass} name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input className={inputClass} type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
        <input className={inputClass} type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        <input className={inputClass} name="score" placeholder="Marks/Percentage/GPA" value={formData.score} onChange={handleChange} />

        <div className="flex gap-2">
          <button type="submit" className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"}>
            {editIndex !== null ? "Update Education" : "Add Education"}
          </button>
          {editIndex !== null && (
            <button type="button" className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
              setEditIndex(null);
              setFormData({ degree: "", college: "", location: "", startDate: "", endDate: "", score: "" });
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
                <strong>{edu.degree}</strong> at {edu.college} <br />
                <small className="text-gray-400">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ""}</small>
                {edu.location && <p className="mb-0 text-gray-400">{edu.location}</p>}
                {edu.score && <p className="mb-0">Score: {edu.score}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                  onClick={() => { setFormData(edu); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Edit
                </button>
                <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                  onClick={() => setEducation(education.filter((_, i) => i !== idx))}>
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
