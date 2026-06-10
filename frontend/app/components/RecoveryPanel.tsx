export default function RecoveryPanel({
  recovery,
  risk,
}: {
  recovery: { priority: string; actions: string[] };
  risk?: { risk: string; flags?: string[]; action?: string };
}) {
  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <h2>Recovery ({recovery.priority})</h2>
      <ul>
        {recovery.actions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      {risk && risk.risk === "ELEVATED" && (
        <div style={{ color: "#ef4444" }}>
          <strong>Risk: {risk.risk}</strong>
          <ul>{risk.flags?.map((f) => <li key={f}>{f}</li>)}</ul>
          <p>{risk.action}</p>
        </div>
      )}
    </div>
  );
}
