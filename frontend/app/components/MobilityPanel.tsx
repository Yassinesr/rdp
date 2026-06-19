export default function MobilityPanel({
  mobility,
}: {
  mobility: { duration_min: number; focus: string[] };
}) {
  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <h2>Mobility ({mobility.duration_min} min)</h2>
      <ul>
        {mobility.focus.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
