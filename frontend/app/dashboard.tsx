"use client";

import ReadinessCard from "./components/ReadinessCard";
import NutritionPanel from "./components/NutritionPanel";
import WorkoutPlan from "./components/WorkoutPlan";
import RecoveryPanel from "./components/RecoveryPanel";

export default function Dashboard({ data }: { data: any }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <h1>Daily Coach</h1>

      <ReadinessCard readiness={data.readiness} />
      <NutritionPanel calories={data.calories} macros={data.macros} hydration={data.hydration} />
      <WorkoutPlan fueling={data.fueling} />
      <RecoveryPanel recovery={data.recovery} risk={data.risk} />

      {data.summary && (
        <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
          <h2>Coach Notes</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.summary}</p>
        </div>
      )}
    </div>
  );
}
