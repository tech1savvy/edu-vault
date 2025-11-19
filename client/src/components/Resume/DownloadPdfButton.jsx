// client/src/components/Resume/DownloadPdfButton.jsx
import React from "react";
import html2pdf from "html2pdf.js";

export default function DownloadPdfButton({ filename = "My-Resume.pdf", rootId = "cv-template" }) {
  const handleDownload = async () => {
    const element = document.getElementById(rootId) || document.getElementById("resume-root");
    if (!element) {
      alert("CV template not found in DOM. Make sure the CVTemplate is mounted and has id='"+rootId+"' or 'resume-root'.");
      return;
    }

    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right (mm)
      filename,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, allowTaint: true },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak:    { mode: ["css", "legacy"] },
    };

    try {
      // show a short hint to the user (optional)
      // start the export
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF (see console).");
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleDownload}>
      Download CV (PDF)
    </button>
  );
}
