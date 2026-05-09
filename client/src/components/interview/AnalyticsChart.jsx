import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CHART_PRIMARY = "#22d3ee";
const CHART_MUTED = "rgba(148,163,184,0.25)";
const CHART_CORRECT = "#34d399";
const CHART_INCORRECT = "#f87171";
const CHART_SKIPPED = "rgba(148,163,184,0.55)";

/**
 * Circular match confidence visualization (percent 0–100).
 */
export function MatchConfidenceRadial({ percentage }) {
  const pct = Math.min(100, Math.max(0, Number(percentage) || 0));
  const rest = Math.max(0.0001, 100 - pct);
  const data = [
    { name: "Matched", value: pct, fill: CHART_PRIMARY },
    { name: "", value: rest, fill: CHART_MUTED },
  ];

  return (
    <div className="position-relative w-100" style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={82}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            isAnimationActive
          >
            {data.map((entry, idx) => (
              <Cell key={`conf-${idx}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={() => `${Math.round(pct)}% match confidence`}
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: "0.35rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none">
        <div className="h3 mb-0 text-info">{Math.round(pct)}%</div>
        <small className="interview-text-muted text-uppercase small">confidence</small>
      </div>
    </div>
  );
}

/**
 * Donut: correct / incorrect / skipped.
 */
export function ResultDonut({ correct = 0, incorrect = 0, skipped = 0 }) {
  const data = [
    { name: "Correct", value: Math.max(0, correct), fill: CHART_CORRECT },
    { name: "Incorrect", value: Math.max(0, incorrect), fill: CHART_INCORRECT },
    { name: "Skipped", value: Math.max(0, skipped), fill: CHART_SKIPPED },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    data.push({ name: "No data", value: 1, fill: CHART_MUTED });
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="position-relative w-100" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.fill} stroke="rgba(15,23,42,0.8)" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: "0.35rem",
            }}
            formatter={(value, name) => {
              const pct = total ? `${Math.round((value / total) * 100)}%` : "";
              return [`${value} (${pct})`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div className="h5 mb-0">{total}</div>
        <small className="interview-text-muted">attempts</small>
      </div>
    </div>
  );
}

export default MatchConfidenceRadial;
