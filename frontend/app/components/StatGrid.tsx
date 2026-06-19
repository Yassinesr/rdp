const card = {
  background: "#1a1d27",
  borderRadius: 12,
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column" as const,
  gap: 4,
};

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div style={card}>
      <span style={{ fontSize: 12, color: "#8b90a0", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700, color: accent ?? "#e6e8ee" }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: "#8b90a0" }}>{sub}</span>}
    </div>
  );
}

const READINESS_COLORS: Record<string, string> = {
  GREEN: "#22c55e",
  YELLOW: "#eab308",
  ORANGE: "#f97316",
  RED: "#ef4444",
};

export default function StatGrid({
  readiness,
  metrics,
  trainingLoad,
}: {
  readiness: { score: number; state: string };
  metrics: any;
  trainingLoad: any;
}) {
  const rhrDelta =
    metrics?.resting_hr != null && metrics?.baseline_rhr != null
      ? metrics.resting_hr - metrics.baseline_rhr
      : null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
      }}
    >
      <Stat
        label="Readiness"
        value={readiness.state}
        sub={`Score ${readiness.score}`}
        accent={READINESS_COLORS[readiness.state]}
      />
      {trainingLoad?.ratio != null && (
        <Stat label="Load Ratio" value={trainingLoad.ratio} sub={trainingLoad.status} />
      )}
      {metrics?.sleep_score != null && (
        <Stat label="Sleep" value={metrics.sleep_score} sub="sleep score" />
      )}
      {metrics?.hrv != null && (
        <Stat label="HRV" value={`${metrics.hrv} ms`} sub={metrics.hrv_status ?? ""} />
      )}
      {metrics?.resting_hr != null && (
        <Stat
          label="Resting HR"
          value={`${metrics.resting_hr} bpm`}
          sub={rhrDelta != null ? `${rhrDelta >= 0 ? "+" : ""}${rhrDelta} vs base` : undefined}
        />
      )}
      {metrics?.body_battery != null && (
        <Stat label="Body Battery" value={metrics.body_battery} />
      )}
      {metrics?.sleep_debt_hours != null && (
        <Stat label="Sleep Debt" value={`${metrics.sleep_debt_hours} h`} />
      )}
    </div>
  );
}
