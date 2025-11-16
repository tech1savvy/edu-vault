import React from 'react';

const Achievements = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Achievements</h2>
      {data && data.length > 0 ? (
        <ul className="achievements-list">
          {data.map((ach) => (
            <li key={ach.id}>
              <strong>{ach.title}</strong> ({ach.date}): {ach.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No achievements to display.</p>
      )}
    </section>
  );
};

export default Achievements;
