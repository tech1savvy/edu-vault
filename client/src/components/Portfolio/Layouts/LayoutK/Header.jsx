import React from 'react';

const Header = ({ data }) => {
  if (!data) {
    return (
      <header className="portfolio-header">
        <h1>Loading...</h1>
      </header>
    );
  }

  return (
    <header className="portfolio-header">
      <h1>{data.name}</h1>
      <p>{data.role}</p>
      <div className="contact-info">
        <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.location}</span>
      </div>
      {data.link && <a href={data.link} target="_blank" rel="noopener noreferrer">Portfolio/LinkedIn</a>}
    </header>
  );
};

export default Header;
