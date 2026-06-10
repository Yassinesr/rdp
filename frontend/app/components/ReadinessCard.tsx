const STATE_COLORS: Record<string, string> = {
  GREEN: "#22c55e",
  YELLOW: "#eab308",
  ORANGE: "#f97316",
  RED: "#ef4444",
};

export default function ReadinessCard({
  readiness,
}: {
  readiness: { score: number; state: string };
}) {
  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <h2>Readiness</h2>
      <p style={{ fontSize: 32, fontWeight: 700, color: STATE_COLORS[readiness.state] ?? "#e6e8ee" }}>
        {readiness.state}
      </p>
      <p>Score: {readiness.score}</p>
    </div>
  );
}
