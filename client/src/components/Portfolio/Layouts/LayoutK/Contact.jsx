import React from 'react';

const Contact = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <section className="portfolio-section">
      <h2>Contact Me</h2>
      <p>
        You can reach me by email at <a href={`mailto:${data.email}`}>{data.email}</a>.
      </p>
      {data.link && (
        <p>
          You can also find me on <a href={data.link} target="_blank" rel="noopener noreferrer">LinkedIn or my Portfolio</a>.
        </p>
      )}
    </section>
  );
};

export default Contact;
