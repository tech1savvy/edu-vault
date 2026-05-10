export default function ProgressBar({ answeredCount, total, currentIndex }) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.round((answeredCount / safeTotal) * 100));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-1 interview-text-muted small">
        <span>Answered</span>
        <span>
          <strong>{answeredCount}</strong> / {safeTotal}{" "}
          {typeof currentIndex === "number" && (
            <>
              • Q<strong>{currentIndex + 1}</strong>
            </>
          )}
        </span>
      </div>
      <div className="progress interview-progress-wrap" style={{ height: "0.5rem", background: "rgba(148,163,184,0.15)" }}>
        <div className="progress-bar bg-gradient" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#22d3ee)" }} />
      </div>
    </div>
  );
}
