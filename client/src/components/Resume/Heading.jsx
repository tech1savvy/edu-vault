import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Heading() {
  const { heading } = useContext(ResumeContext);
  const h = heading && typeof heading === "object" ? heading : null;
  const hasContent =
    h &&
    (h.name ||
      h.role ||
      h.email ||
      h.phone ||
      h.location ||
      h.link ||
      h.description);

  if (!hasContent) {
    return (
      <p className="m-3 text-danger">
        No heading data yet. Add your profile under Profile or Heading.
      </p>
    );
  }

  const contactBits = [h.email, h.phone, h.location].filter(Boolean).join(" · ");

  return (
    <div className="container mt-4 rounded border border-slate-200 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <h2 className="fw-bold">{h.name || "Your name"}</h2>
      {contactBits && <p className="mb-2">{contactBits}</p>}

      {h.link && (
        <div className="d-flex gap-3 mb-2">
          <a href={h.link} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400">
            Link / portfolio
          </a>
        </div>
      )}

      {h.role && <h5 className="text-slate-600 dark:text-slate-300">{h.role}</h5>}
      {h.description && <p>{h.description}</p>}
    </div>
  );
}

export default Heading;
