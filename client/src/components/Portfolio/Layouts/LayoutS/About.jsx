// // client/src/components/Portfolio/Layouts/LayoutS/About.jsx
// import React from "react";

// export default function About({ data = {} }) {
//   const bio = data.summaryLong || data.summary || "";
//   return (
//     <section className="ls-card" aria-labelledby="about-heading">
//       <div className="ls-section-title">
//         <h2 id="about-heading">About</h2>
//         <div className="underline" />
//       </div>
//       <div className="ls-muted">{bio || "Add a description in the heading form."}</div>
//     </section>
//   );
// }



import React from "react";

export default function About({ data = {} }) {
  const role = data.role || data.title || "";
  const summary = data.summary || data.description || data.bio || "";

  if (!role && !summary) {
    return (
      <section className="portfolio-section about-section-enhanced">
        <h2 className="about-title">About</h2>
        <div className="about-underline"></div>
        <p className="about-muted">Add a short bio or summary in the Heading form.</p>
      </section>
    );
  }

  return (
    <section className="portfolio-section about-section-enhanced">
      <div className="about-blob blob-top-right"></div>
      <div className="about-blob blob-bottom-left"></div>

      <div className="about-content-wrapper">
        <h2 className="about-title">About Me</h2>
        <div className="about-underline"></div>

        {role && <p className="about-role">I am a <span className="about-highlight">{role}</span></p>}
        {summary && <p className="about-description">{summary}</p>}
      </div>
    </section>
  );
}

