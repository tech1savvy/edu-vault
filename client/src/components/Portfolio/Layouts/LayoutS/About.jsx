import React from "react";

export default function About({ data = {} }) {
  const bio = data.summaryLong || data.summary || data.description || data.bio || "";
  if (!bio) return null;
  
  return (
    <section className="ls-section">
      <h2 className="ls-section-title">About Me</h2>
      <div className="ls-card-desc">
        {bio}
      </div>
    </section>
  );
}

