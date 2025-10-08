import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext.jsx";

function Achievements() {
  const { achievements } = useContext(ResumeContext);

  return (
    <div className="container">
      <h2 className="mb-3">Achievements</h2>
      {achievements.length === 0 ? (
        <p>No achievements added yet.</p>
      ) : (
        <ul className="list-unstyled">
          {achievements.map((achievement, idx) => (
            <li key={idx} className="mb-3">
              <strong className="d-block">{achievement.title}</strong>
              {achievement.description && (
                <p className="mb-1 text-muted">{achievement.description}</p>
              )}
              {achievement.date && (
                <small className="text-muted">{achievement.date}</small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Achievements;