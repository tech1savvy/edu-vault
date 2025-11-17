// import React from 'react';
//
// const Contact = ({ data }) => {
//   if (!data) {
//     return null;
//   }
//
//   return (
//     <section className="portfolio-section">
//       <h2>Contact Me</h2>
//       <p>
//         You can reach me by email at <a href={`mailto:${data.email}`}>{data.email}</a>.
//       </p>
//       {data.link && (
//         <p>
//           You can also find me on <a href={data.link} target="_blank" rel="noopener noreferrer">LinkedIn or my Portfolio</a>.
//         </p>
//       )}
//     </section>
//   );
// };
//
// export default Contact;

import React from "react";

const Contact = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <section className="portfolio-section about-section-enhanced">
      {/* Decorative Blobs (New positions for variety) */}
      <div className="about-blob blob-top-left"></div>
      <div className="about-blob blob-bottom-right"></div>

      <div className="about-content-wrapper">
        <h2 className="about-title">Contact Me</h2>
        <div className="about-underline"></div>

        <div className="contact-wrapper">
          {/* Email Card */}
          <div className="contact-card">
            <div className="contact-icon-box">
              <svg
                className="contact-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="contact-details">
              <p className="contact-label">Email me at</p>
              <a href={`mailto:${data.email}`} className="contact-link">
                {data.email}
              </a>
            </div>
          </div>

          {/* External Link Card */}
          {data.link && (
            <div className="contact-card">
              <div className="contact-icon-box box-alt">
                <svg
                  className="contact-icon-svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>

              <div className="contact-details">
                <p className="contact-label">Find me online</p>
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  LinkedIn / Portfolio
                  <svg
                    className="contact-arrow-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
