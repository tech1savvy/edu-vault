import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Achievements() {
  const { achievements } = useContext(ResumeContext);

  return (
    <div className="theme-card p-3">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Achievements</h2>
      {achievements.length === 0 ? (
        <p className="text-gray-400 text-sm">No achievements added yet.</p>
      ) : (
        <ul className="list-none p-0 space-y-3">
          {achievements.map((achievement, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              <strong className="block text-gray-100">{achievement.title}</strong>
              {achievement.description && <p className="mb-1 text-gray-400">{achievement.description}</p>}
              {achievement.date && <small className="text-gray-400">{achievement.date}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Achievements;
