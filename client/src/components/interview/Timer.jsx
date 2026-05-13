import { useMemo } from "react";
import { Clock } from "lucide-react";

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
      className={`flex items-center gap-2 px-3 py-2 rounded-3 interview-card ${
        isDanger ? "border border-red-400/50 shadow-sm" : ""
      }`}
    >
      <Clock className="text-cyan-400 w-5 h-5" aria-hidden />
      <div className="flex flex-col">
        <small className="uppercase interview-text-muted" style={{ fontSize: "0.65rem" }}>
          {label}
        </small>
        <span className={`text-xl font-mono ${isDanger ? "text-red-400" : ""}`}>{text}</span>
      </div>
    </div>
  );
}
