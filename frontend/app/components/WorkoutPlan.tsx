export default function WorkoutPlan({
  fueling,
}: {
  fueling: { carbs_per_hour: number; total_carbs: number; strategy: string };
}) {
  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <h2>Ride Fueling</h2>
      <ul>
        <li>Carbs per hour: {fueling.carbs_per_hour} g</li>
        <li>Total carbs: {Math.round(fueling.total_carbs)} g</li>
        <li>Strategy: {fueling.strategy}</li>
      </ul>
    </div>
  );
}
