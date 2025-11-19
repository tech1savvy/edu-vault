import React from "react";

export default function Header({ data = {} }) {
  const name = data?.name || "Your Name";
  const title = data?.title || "Your Profession";
  const summary = data?.summary || "Short one-line summary about yourself.";

  return (
    <header className="ls-header">
      <div className="ls-hero">
        <h1>{name}</h1>
        <p className="lead">{title}</p>
        <p className="ls-muted">{summary}</p>
      </div>
    </header>
  );
}
