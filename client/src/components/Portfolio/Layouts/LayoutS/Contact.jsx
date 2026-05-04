import React from "react";

export default function Contact({ data = {} }) {
  const email = data.email || data.contact || "";
  const phone = data.phone || data.contactPhone || "";
  const location = data.location || data.city || "";
  const link = data.link || data.portfolio || data.linkedin || "";

  return (
    <div className="ls-sidebar" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, flex: 1, justifyContent: 'flex-end', paddingTop: 0 }}>
      <div className="ls-contact-list">
        {email && (
          <a href={`mailto:${email}`} className="ls-contact-item">
            <span className="ls-contact-icon">📧</span>
            <span>{email}</span>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="ls-contact-item">
            <span className="ls-contact-icon">📱</span>
            <span>{phone}</span>
          </a>
        )}
        {location && (
          <div className="ls-contact-item" style={{cursor: 'default'}}>
            <span className="ls-contact-icon">📍</span>
            <span>{location}</span>
          </div>
        )}
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="ls-contact-item">
            <span className="ls-contact-icon">🔗</span>
            <span>Portfolio / LinkedIn</span>
          </a>
        )}
      </div>
    </div>
  );
}
