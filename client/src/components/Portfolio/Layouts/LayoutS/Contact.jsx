// import React from "react";

// export default function Contact({ data = {} }) {
//   return (
//     <div>
//       <h2>Contact</h2>
//       <div className="ls-underline" />
//       <div style={{ marginTop: 12 }} className="ls-muted">
//         {data?.email && <div>Email: {data.email}</div>}
//         {data?.phone && <div>Phone: {data.phone}</div>}
//         {data?.location && <div>Location: {data.location}</div>}
//         {!data?.email && !data?.phone && !data?.location && <div>No contact details added.</div>}
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function Contact({ data = {} }) {
  const email = data.email || data.contact || "";
  const phone = data.phone || data.contactPhone || "";
  const location = data.location || data.city || "";
  const link = data.link || data.portfolio || data.linkedin || "";

  if (!email && !phone && !location && !link) {
    return (
      <section className="portfolio-section about-section-enhanced">
        <h2 className="about-title">Contact</h2>
        <div className="about-underline"></div>
        <p className="about-muted">Add contact details in Heading form to appear here.</p>
      </section>
    );
  }

  return (
    <section className="portfolio-section about-section-enhanced">
      <div className="about-blob blob-top-left"></div>
      <div className="about-blob blob-bottom-right"></div>

      <div className="about-content-wrapper">
        <h2 className="about-title">Contact Me</h2>
        <div className="about-underline"></div>

        <div className="contact-wrapper">
          {email && (
            <div className="contact-card">
              <div className="contact-icon-box">
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                </svg>
              </div>
              <div className="contact-details">
                <p className="contact-label">Email</p>
                <a className="contact-link" href={`mailto:${email}`}>{email}</a>
              </div>
            </div>
          )}

          {phone && (
            <div className="contact-card">
              <div className="contact-icon-box box-alt">
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493" />
                </svg>
              </div>
              <div className="contact-details">
                <p className="contact-label">Phone</p>
                <div className="contact-link">{phone}</div>
              </div>
            </div>
          )}

          {link && (
            <div className="contact-card">
              <div className="contact-icon-box box-alt">
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4" />
                </svg>
              </div>
              <div className="contact-details">
                <p className="contact-label">Online</p>
                <a className="contact-link" href={link} target="_blank" rel="noreferrer">{link}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
