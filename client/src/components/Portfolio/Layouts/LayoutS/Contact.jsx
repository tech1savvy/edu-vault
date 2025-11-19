import React from "react";

export default function Contact({ data = {} }) {
  return (
    <div>
      <h2>Contact</h2>
      <div className="ls-underline" />
      <div style={{ marginTop: 12 }} className="ls-muted">
        {data?.email && <div>Email: {data.email}</div>}
        {data?.phone && <div>Phone: {data.phone}</div>}
        {data?.location && <div>Location: {data.location}</div>}
        {!data?.email && !data?.phone && !data?.location && <div>No contact details added.</div>}
      </div>
    </div>
  );
}
