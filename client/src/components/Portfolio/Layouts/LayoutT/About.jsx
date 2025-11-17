// import React from 'react';
//
// const About = ({ data }) => {
//   if (!data) {
//     return null;
//   }
//
//   return (
//     <section className="portfolio-section">
//       <h2>About Me</h2>
//       <p>
//         A passionate and dedicated {data.role} with a love for creating
//         efficient, scalable, and user-friendly web applications. I am always
//         eager to learn new technologies and take on challenging projects.
//       </p>
//     </section>
//   );
// };
//
// export default About;

import React from "react";

const About = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <section className="portfolio-section about-section-enhanced group">
      {/* Decorative Blobs */}
      <div className="about-blob blob-top-right"></div>
      <div className="about-blob blob-bottom-left"></div>

      <div className="about-content-wrapper">
        <h2 className="about-title">About Me</h2>

        <div className="about-underline"></div>

        <p className="about-description">
          A passionate and dedicated{" "}
          <span className="about-highlight">{data.role}</span> with a love for
          creating efficient, scalable, and user-friendly web applications. I am
          always eager to learn new technologies and take on challenging
          projects.
        </p>
      </div>
    </section>
  );
};

export default About;
