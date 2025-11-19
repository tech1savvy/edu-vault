import React from "react";
import html2pdf from "html2pdf.js";

export default function DownloadPdfButton({
  selector="#cv-root",
  filename = "My-CV.pdf",
}) {
  const downloadPdf = () => {
    const element = document.querySelector(selector);
    if (!element) {
      alert("Could not find resume content.");
      return;
    }

    const opt = {
      margin: 10,
      filename,
      html2canvas: { scale: 2, scrollX: 0, scrollY: -window.scrollY },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button className="btn btn-primary" onClick={downloadPdf}>
      Download CV as PDF
    </button>
  );
}
