import React from 'react';

const Experience = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Experience</h2>
      {data && data.length > 0 ? (
        <div className="experience-list">
          {data.map((exp) => (
            <div key={exp.id} className="experience-item">
              <h3>{exp.role}</h3>
              <h4>{exp.company}</h4>
              <p className="experience-duration">{exp.duration}</p>
              <p>{exp.details}</p>
              <span className="badge">{exp.type}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No experience to display.</p>
      )}
    </section>
  );
};

export default Experience;
