// client/src/components/Resume/DownloadPdfButton.jsx
import React from "react";
import html2pdf from "html2pdf.js";

export default function DownloadPdfButton({ filename = "My-Resume.pdf", rootId = "cv-template" }) {
  const handleDownload = async () => {
    const originalElement = document.getElementById(rootId) || document.getElementById("resume-root");
    if (!originalElement) {
      alert("CV template not found in DOM.");
      return;
    }

    // 100% BULLETPROOF FIX: html2canvas hates hidden elements.
    // So we create a fully visible container that covers the screen temporarily,
    // inject the raw HTML, capture it, and destroy it instantly.
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.top = "0";
    tempContainer.style.left = "0";
    tempContainer.style.width = "210mm";
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.zIndex = "999999"; // Sit on top of everything
    
    // We clone the node deeply so it retains all inline styles and classes
    const clone = originalElement.cloneNode(true);
    // Remove any hidden styles from the clone
    clone.style.position = "relative";
    clone.style.left = "auto";
    clone.style.top = "auto";
    clone.style.opacity = "1";
    clone.style.zIndex = "1";
    clone.style.display = "block";
    clone.style.pointerEvents = "auto";

    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right (mm)
      filename,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: true, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak:    { mode: ["css", "legacy"] },
    };

    try {
      // Give browser a tiny tick to paint the tempContainer
      await new Promise(r => setTimeout(r, 150));
      
      await html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF (see console).");
    } finally {
      // Remove the flash container
      document.body.removeChild(tempContainer);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleDownload}>
      Download CV (PDF)
    </button>
  );
}
