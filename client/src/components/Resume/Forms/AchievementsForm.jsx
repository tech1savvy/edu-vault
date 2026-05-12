import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";
import { addAchievement, updateAchievement, deleteAchievement } from "../../../services/api";

function AchievementsForm({ embedded = false }) {
  const { achievements, setAchievements } = useContext(ResumeContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    try {
      if (editingId) {
        const updated = await updateAchievement(editingId, form);
        setAchievements(achievements.map((a) => (a.id === editingId ? updated : a)));
        setEditingId(null);
      } else {
        const created = await addAchievement(form);
        setAchievements([...achievements, created]);
      }
      setForm({
        title: "",
        description: "",
        date: ""
      });
    } catch (error) {
      console.error("Failed to save achievement:", error);
    }
  };

  const handleEdit = (achievement) => {
    setForm({
      title: achievement.title,
      description: achievement.description || "",
      date: achievement.date || ""
    });
    setEditingId(achievement.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAchievement(id);
      setAchievements(achievements.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Failed to delete achievement:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      date: ""
    });
  };

  return (
    <div className={embedded ? "" : "container mt-3"}>
      {!embedded && (
        <>
          <h2 className="mb-3">Achievements Section</h2>
          <p className="text-muted">Add your achievements, awards, and recognitions</p>
        </>
      )}

      <div className="card p-3 mb-4">
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

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {editingId ? "Update Achievement" : "Add Achievement"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {!embedded && <hr />}

      {!embedded && <h4>Saved Achievements</h4>}
      {embedded && <h4 className="mb-3 mt-4">Saved achievements</h4>}
      {achievements.length === 0 && <p className="text-muted">No achievements added yet.</p>}
      <div className="list-group">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between align-items-start">
              <div className="w-75">
                <h5 className="mb-1">{achievement.title}</h5>
                {achievement.description && (
                  <p className="mb-1 mt-1 text-muted">{achievement.description}</p>
                )}
                {achievement.date && (
                  <small className="text-secondary">{achievement.date}</small>
                )}
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(achievement)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(achievement.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsForm;
