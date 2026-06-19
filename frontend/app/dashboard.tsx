"use client";

import StatGrid from "./components/StatGrid";
import ReadinessCard from "./components/ReadinessCard";
import TrainingLoadCard from "./components/TrainingLoadCard";
import NutritionPanel from "./components/NutritionPanel";
import WorkoutPlan from "./components/WorkoutPlan";
import RecoveryPanel from "./components/RecoveryPanel";
import MobilityPanel from "./components/MobilityPanel";

export default function Dashboard({ data }: { data: any }) {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24, display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>Daily Coach</h1>
        <p style={{ color: "#8b90a0", margin: 0 }}>
          {data.metrics?.workout_type
            ? `Planned: ${data.metrics.workout_type} ride`
            : "Today's plan"}
        </p>
      </div>

      <StatGrid readiness={data.readiness} metrics={data.metrics} trainingLoad={data.training_load} />

      {data.training_load && <TrainingLoadCard tl={data.training_load} />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <ReadinessCard readiness={data.readiness} />
        <NutritionPanel calories={data.calories} macros={data.macros} hydration={data.hydration} />
        <WorkoutPlan fueling={data.fueling} />
        <RecoveryPanel recovery={data.recovery} risk={data.risk} />
        <MobilityPanel mobility={data.mobility} />
      </div>

      {data.summary && (
        <div style={{ background: "#1a1d27", borderRadius: 12, padding: 20 }}>
          <h2>Coach Notes</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{data.summary}</p>
        </div>
      )}
    </div>
  );
}
