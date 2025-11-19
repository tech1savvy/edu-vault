// import React from "react";

// export default function Header({ data = {} }) {
//   const name = data?.name || "Your Name";
//   const title = data?.title || "Your Profession";
//   const summary = data?.summary || "Short one-line summary about yourself.";

//   return (
//     <header className="ls-header">
//       <div className="ls-hero">
//         <h1>{name}</h1>
//         <p className="lead">{title}</p>
//         <p className="ls-muted">{summary}</p>
//       </div>
//     </header>
//   );
// }



import React from "react";

export default function Header({ data = {} }) {
  if (!Object.keys(data).length) {
    return (
      <header className="header-enhanced header-loading">
        <div className="skeleton-bar skeleton-title"></div>
        <div className="skeleton-bar skeleton-subtitle"></div>
      </header>
    );
  }

  return (
    <header className="header-enhanced">
      <div className="header-bg-overlay" />
      <div className="header-content">
        <h1 className="header-title">{data.name || data.fullName || "Your Name"}</h1>
        <p className="header-role">{data.role || data.title || data.profession}</p>

        <div className="header-contact-bar">
          {data.email && <span className="contact-item">{data.email}</span>}
          {data.phone && <span className="contact-item">{data.phone}</span>}
          {data.location && <span className="contact-item">{data.location}</span>}
        </div>

        {data.link && (
          <a className="header-btn" href={data.link} target="_blank" rel="noreferrer">
            <span>View Portfolio</span>
          </a>
        )}
      </div>
    </header>
  );
}
