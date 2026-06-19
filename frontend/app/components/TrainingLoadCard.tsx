const STATUS_COLORS: Record<string, string> = {
  DETRAINING: "#3b82f6",
  OPTIMAL: "#22c55e",
  HIGH: "#f97316",
  DANGER: "#ef4444",
  UNKNOWN: "#6b7280",
};

// Match the backend gauge scale (engine/training_load.py).
const SCALE_MIN = 0.5;
const SCALE_MAX = 1.75;
const pct = (r: number) =>
  Math.max(0, Math.min(100, ((r - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));

export default function TrainingLoadCard({ tl }: { tl: any }) {
  const color = STATUS_COLORS[tl.status] ?? "#6b7280";

  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Training Load</h2>
        <span
          style={{
            color,
            fontWeight: 700,
            fontSize: 14,
            border: `1px solid ${color}`,
            borderRadius: 999,
            padding: "2px 10px",
          }}
        >
          {tl.status}
        </span>
      </div>

      {tl.ratio == null ? (
        <p style={{ color: "#8b90a0" }}>{tl.message}</p>
      ) : (
        <>
          <p style={{ color: "#8b90a0", margin: "8px 0 16px" }}>
            Acute:chronic ratio <strong style={{ color: "#e6e8ee" }}>{tl.ratio}</strong>{" "}
            (acute {tl.acute} / chronic {tl.chronic}). Optimal band {tl.optimal_low}–
            {tl.optimal_high}.
          </p>

          {/* ACWR gauge: shaded optimal band 0.8–1.3 with a marker at current ratio */}
          <div style={{ position: "relative", height: 14, background: "#0f1117", borderRadius: 7, marginBottom: 6 }}>
            <div
              style={{
                position: "absolute",
                left: `${pct(0.8)}%`,
                width: `${pct(1.3) - pct(0.8)}%`,
                top: 0,
                bottom: 0,
                background: "rgba(34,197,94,0.25)",
                borderLeft: "1px solid #22c55e",
                borderRight: "1px solid #22c55e",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `calc(${pct(tl.ratio)}% - 2px)`,
                top: -3,
                bottom: -3,
                width: 4,
                background: color,
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280" }}>
            <span>0.5</span>
            <span>0.8</span>
            <span>1.3</span>
            <span>1.75</span>
          </div>

          <ul style={{ marginTop: 16, marginBottom: 0, lineHeight: 1.6 }}>
            {tl.recommendations.map((r: string) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
