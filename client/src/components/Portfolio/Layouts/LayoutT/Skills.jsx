// import React from 'react';
//
// const Skills = ({ data }) => {
//   return (
//     <section className="portfolio-section">
//       <h2>Skills</h2>
//       {data && data.length > 0 ? (
//         <ul className="skills-list">
//           {data.map((skill) => (
//             <li key={skill.id}>
//               {skill.name} ({skill.level})
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No skills to display.</p>
//       )}
//     </section>
//   );
// };
//
// export default Skills;

import React from "react";

const Skills = ({ data }) => {
  // Helper to assign CSS classes based on skill level
  const getSkillVariant = (level) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes("expert") || lowerLevel.includes("advanced")) {
      return "skill-variant-primary";
    }
    if (lowerLevel.includes("intermediate")) {
      return "skill-variant-secondary";
    }
    return "skill-variant-default";
  };

  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Reuse generic header styles */}
      <h2 className="about-title">Skills</h2>
      <div className="about-underline"></div>

      {data && data.length > 0 ? (
        <div className="skills-flex-container">
          {data.map((skill, index) => (
            <div
              key={skill.id}
              className={`skill-pill ${getSkillVariant(skill.level)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Subtle background hover effect layer */}
              <div className="skill-pill-bg"></div>

              <div className="skill-content">
                <span className="skill-name">{skill.name}</span>

                <span className="skill-level-badge">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="achievement-empty">No skills to display.</p>
      )}
    </section>
  );
};

export default Skills;
