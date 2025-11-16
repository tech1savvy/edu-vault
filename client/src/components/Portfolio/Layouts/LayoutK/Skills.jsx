import React from 'react';

const Skills = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Skills</h2>
      {data && data.length > 0 ? (
        <ul className="skills-list">
          {data.map((skill) => (
            <li key={skill.id}>
              {skill.name} ({skill.level})
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills to display.</p>
      )}
    </section>
  );
};

export default Skills;
