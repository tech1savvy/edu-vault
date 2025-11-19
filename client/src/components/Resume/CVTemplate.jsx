// client/src/components/Resume/CVTemplate.jsx
import React from "react";
import "./CVTemplate.css";

export default function CVTemplate({ visible = true }) {
  const style = visible ? {} : { position: "absolute", left: "-9999px", top: 0, width: "210mm" /* A4 width */ };
  return (
    <div id="cv-template" style={style} className="cv-template">
      {/* your CV markup — header, contact, experience, education etc. */}
    </div>
  );
}
