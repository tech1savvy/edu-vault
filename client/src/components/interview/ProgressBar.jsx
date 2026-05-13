export default function ProgressBar({ answeredCount, total, currentIndex }) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.round((answeredCount / safeTotal) * 100));

  return (
    <div>
      <div className="flex justify-between items-center mb-1 interview-text-muted text-xs">
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
      <div className="h-2 bg-gray-400/15 rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.15)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#6366f1,#22d3ee)",
          }}
        />
      </div>
    </div>
  );
}
