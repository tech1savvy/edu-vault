// import React from 'react';
//
// const Header = ({ data }) => {
//   if (!data) {
//     return (
//       <header className="portfolio-header">
//         <h1>Loading...</h1>
//       </header>
//     );
//   }
//
//   return (
//     <header className="portfolio-header">
//       <h1>{data.name}</h1>
//       <p>{data.role}</p>
//       <div className="contact-info">
//         <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.location}</span>
//       </div>
//       {data.link && <a href={data.link} target="_blank" rel="noopener noreferrer">Portfolio/LinkedIn</a>}
//     </header>
//   );
// };
//
// export default Header;

import React from "react";

const Header = ({ data }) => {
  // Loading State
  if (!data) {
    return (
      <header className="header-enhanced header-loading">
        <div className="skeleton-bar skeleton-title"></div>
        <div className="skeleton-bar skeleton-subtitle"></div>
      </header>
    );
  }

  return (
    <header className="header-enhanced">
      {/* Background Overlay for subtle gradient effect */}
      <div className="header-bg-overlay"></div>

      <div className="header-content">
        <h1 className="header-title">{data.name}</h1>

        <p className="header-role">{data.role}</p>

        <div className="header-contact-bar">
          <span className="contact-item">
            <svg
              className="header-icon"
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
            {data.email}
          </span>

          <span className="contact-item">
            <svg
              className="header-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {data.phone}
          </span>

          <span className="contact-item">
            <svg
              className="header-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {data.location}
          </span>
        </div>

        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="header-btn"
          >
            <span>View Portfolio</span>
            <svg
              className="header-icon"
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
        )}
      </div>
    </header>
  );
};

export default Header;
