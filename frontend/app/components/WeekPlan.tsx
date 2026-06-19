const TYPE_COLORS: Record<string, string> = {
  recovery: "#38bdf8",
  endurance: "#22c55e",
  threshold: "#f97316",
  vo2max: "#ef4444",
};

function weekday(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

export default function WeekPlan({
  days,
  live,
}: {
  days: any[];
  live?: boolean;
}) {
  if (!days || days.length === 0) return null;

  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Upcoming Workouts → Fuel</h2>
        {!live && (
          <span style={{ fontSize: 12, color: "#8b90a0" }}>
            demo plan · connect Garmin to populate from your calendar
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {days.map((d, i) => {
          const color = TYPE_COLORS[d.workout_type] ?? "#8b90a0";
          return (
            <div
              key={d.date ?? i}
              style={{
                background: "#0f1117",
                borderRadius: 10,
                padding: 14,
                borderTop: `3px solid ${color}`,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, color: "#8b90a0" }}>{weekday(d.date)}</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{d.title}</span>
              <span style={{ fontSize: 12, color, fontWeight: 600, textTransform: "uppercase" }}>
                {d.workout_type} · {d.duration_min}m
              </span>
              <div style={{ marginTop: 4, fontSize: 13 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{Math.round(d.macros.carbs_g)} g</div>
                <span style={{ color: "#8b90a0" }}>carbs · {Math.round(d.calories)} kcal</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
