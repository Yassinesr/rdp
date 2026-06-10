export default function NutritionPanel({
  calories,
  macros,
  hydration,
}: {
  calories: number;
  macros: { protein_g: number; carbs_g: number; fat_g: number };
  hydration?: { fluids_ml: number; sodium_mg: number };
}) {
  return (
    <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
      <h2>Nutrition</h2>
      <p style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(calories)} kcal</p>
      <ul>
        <li>Protein: {Math.round(macros.protein_g)} g</li>
        <li>Carbs: {Math.round(macros.carbs_g)} g</li>
        <li>Fat: {Math.round(macros.fat_g)} g</li>
      </ul>
      {hydration && (
        <p>
          Fluids: {Math.round(hydration.fluids_ml)} ml · Sodium:{" "}
          {Math.round(hydration.sodium_mg)} mg
        </p>
      )}
    </div>
  );
}
