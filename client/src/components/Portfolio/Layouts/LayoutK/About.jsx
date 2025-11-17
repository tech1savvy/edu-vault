import React from 'react';

const About = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <section className="portfolio-section">
      <h2>About Me</h2>
      <p>
        A passionate and dedicated {data.role} with a love for creating
        efficient, scalable, and user-friendly web applications. I am always
        eager to learn new technologies and take on challenging projects.
      </p>
    </section>
  );
};

export default About;
