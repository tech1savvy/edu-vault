import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext.jsx";

function AchievementsForm() {
  const { achievements, setAchievements } = useContext(ResumeContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.title.trim()) {
      setAchievements([...achievements, form]);
      setForm({
        title: "",
        description: "",
        date: ""
      });
    }
  };

  const handleRemove = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Achievements Section</h2>
      <p className="text-muted">Add your achievements, awards, and recognitions</p>

      <div className="mb-3">
        <label className="form-label">Achievement Title*</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., 5-Star C++ Programmer on HackerRank"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of the achievement..."
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date/Awarded</label>
        <input
          type="text"
          className="form-control"
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="e.g., 2024, Smart India Hackathon 2024"
        />
      </div>

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Achievement
      </button>

      <hr />

      <h4>Preview</h4>
      {achievements.length === 0 && <p>No achievements added yet.</p>}
      <ul className="list-group">
        {achievements.map((achievement, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{achievement.title}</strong>
                {achievement.description && (
                  <p className="mb-1 mt-1">{achievement.description}</p>
                )}
                {achievement.date && (
                  <small className="text-muted">{achievement.date}</small>
                )}
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

export default AchievementsForm;