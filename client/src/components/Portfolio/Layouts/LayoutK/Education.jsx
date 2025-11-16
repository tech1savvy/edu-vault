import React from 'react';

const Education = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Education</h2>
      {data && data.length > 0 ? (
        <div className="education-list">
          {data.map((edu) => (
            <div key={edu.id} className="education-item">
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <p className="education-duration">{edu.duration}</p>
              <p>{edu.fieldOfStudy}</p>
              <p>{edu.details}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No education to display.</p>
      )}
    </section>
  );
};

export default Education;
