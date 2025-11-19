// client/src/components/Portfolio/Layouts/LayoutS/About.jsx
import React from "react";

export default function About({ data = {} }) {
  const bio = data.summaryLong || data.summary || "";
  return (
    <section className="ls-card" aria-labelledby="about-heading">
      <div className="ls-section-title">
        <h2 id="about-heading">About</h2>
        <div className="underline" />
      </div>
      <div className="ls-muted">{bio || "Add a description in the heading form."}</div>
    </section>
  );
}
