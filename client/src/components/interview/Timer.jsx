import { useMemo } from "react";

function formatRemain(secondsRemaining) {
  const s = Math.max(0, Math.floor(secondsRemaining));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function Timer({ secondsRemaining, label = "Time left", dangerThreshold = 60 }) {
  const text = useMemo(() => formatRemain(secondsRemaining), [secondsRemaining]);
  const isDanger = secondsRemaining <= dangerThreshold;

  return (
    <div
      className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 interview-card ${
        isDanger ? "border border-danger-subtle shadow-sm" : ""
      }`}
    >
      <i className="bi bi-clock-history text-info fs-5" aria-hidden />
      <div className="d-flex flex-column">
        <small className="text-uppercase interview-text-muted " style={{ fontSize: "0.65rem" }}>
          {label}
        </small>
        <span className={`fs-5 font-monospace ${isDanger ? "text-danger" : ""}`}>{text}</span>
      </div>
    </div>
  );
}
