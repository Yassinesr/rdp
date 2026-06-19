"use client";

import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { getDaily, getWeekPlan } from "./lib/api";

// Demo payload — in production this is assembled from the synced
// Garmin data instead of being hardcoded.
const DEMO_INPUT = {
  garmin_readiness: 78,
  sleep_score: 72,
  hrv_status: "balanced",
  hrv: 62,
  baseline_hrv: 65,
  acute_load: 300, // below chronic -> shows the detraining / build-load guidance
  chronic_load: 400,
  resting_hr: 52,
  baseline_rhr: 50,
  sleep_debt_hours: 4,
  body_battery: 68,
  bmr: 2100,
  active_calories: 900,
  recovery_modifier: 0,
  weight_loss_target: 400,
  weight: 107,
  temp_c: 22,
  workout_type: "endurance",
  workout: { duration_min: 120, type: "endurance" },
};

// Demo training week — in production this comes from the Garmin calendar via
// GarminConnectClient.fetch_planned_workouts().
function demoWeek() {
  const fmt = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  return [
    { title: "Recovery Spin", date: fmt(1), estimatedDurationInSecs: 2700 },
    { title: "Endurance Z2", date: fmt(2), estimatedDurationInSecs: 9000 },
    { title: "Threshold 3x12", date: fmt(3), estimatedDurationInSecs: 4200 },
    { title: "VO2 Max 5x4", date: fmt(4), estimatedDurationInSecs: 3600 },
    { title: "Long Endurance", date: fmt(5), estimatedDurationInSecs: 12600 },
  ];
}

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [week, setWeek] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDaily(DEMO_INPUT)
      .then(setData)
      .catch((e) => setError(String(e)));

    getWeekPlan({ profile: null, planned_workouts: demoWeek() })
      .then((r) => setWeek(r.days))
      .catch(() => setWeek(null)); // non-fatal: dashboard still renders
  }, []);

  if (error) return <p style={{ padding: 24 }}>Failed to load: {error}</p>;
  if (!data) return <p style={{ padding: 24 }}>Loading…</p>;

  return <Dashboard data={data} week={week} />;
}
