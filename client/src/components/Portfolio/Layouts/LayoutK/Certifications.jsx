import React from 'react';

const Certifications = ({ data }) => {
  return (
    <section className="portfolio-section">
      <h2>Certifications</h2>
      {data && data.length > 0 ? (
        <ul className="certifications-list">
          {data.map((cert) => (
            <li key={cert.id}>
              <strong>{cert.name}</strong> from {cert.issuer} ({cert.date})
              {cert.credentialId && ` - Credential ID: ${cert.credentialId}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No certifications to display.</p>
      )}
    </section>
  );
};

export default Certifications;
