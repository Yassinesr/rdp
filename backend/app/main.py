from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .engine.readiness import compute_readiness
from .engine.nutrition import calories, macros
from .engine.fueling import fueling_plan
from .engine.recovery import recovery_plan
from .engine.hydration import hydration
from .engine.mobility import mobility_plan
from .engine.risk import risk_check
from .engine.training_load import training_load
from .engine.workout_mapping import classify_planned_workout
from .profile import AthleteProfile, load_profile, profile_summary
from .ai_summary import explain

app = FastAPI(title="Garmin Coach")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fallback values so /day-plan can run before every metric is wired up.
ENGINE_DEFAULTS = {
    "garmin_readiness": 75,
    "sleep_score": 70,
    "hrv_status": "balanced",
    "hrv": 60,
    "baseline_hrv": 60,
    "acute_load": 400,
    "chronic_load": 400,
    "resting_hr": 50,
    "baseline_rhr": 50,
    "sleep_debt_hours": 0,
    "bmr": 1800,
    "active_calories": 600,
    "recovery_modifier": 0,
    "weight_loss_target": 0,
    "weight": 75,
    "temp_c": 20,
    "workout_type": "endurance",
    "workout": {"duration_min": 60, "type": "endurance"},
}


def run_engines(data: dict) -> dict:
    kcal = calories(data)
    result = {
        "readiness": compute_readiness(data),
        "calories": kcal,
        "macros": macros(data, kcal),
        "fueling": fueling_plan(data["workout"]),
        "hydration": hydration(data),
        "recovery": recovery_plan(data),
        "mobility": mobility_plan(data),
        "risk": risk_check(data),
        "training_load": training_load(data),
        # Echo the key inputs so the dashboard can surface raw vitals.
        "metrics": {
            "sleep_score": data.get("sleep_score"),
            "hrv": data.get("hrv"),
            "hrv_status": data.get("hrv_status"),
            "resting_hr": data.get("resting_hr"),
            "baseline_rhr": data.get("baseline_rhr"),
            "sleep_debt_hours": data.get("sleep_debt_hours"),
            "body_battery": data.get("body_battery"),
            "weight": data.get("weight"),
            "workout_type": data.get("workout_type"),
        },
    }

    summary = explain(result)
    if summary:
        result["summary"] = summary

    return result


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/profile")
def profile():
    p = load_profile()
    if not p:
        return {
            "configured": False,
            "message": "No profile found. Fill in ATHLETE_PROFILE.md, save it as "
            "JSON (see profile.example.json) at PROFILE_FILE.",
        }
    return profile_summary(p)


@app.post("/daily")
def daily(data: dict):
    return run_engines(data)


@app.post("/day-plan")
def day_plan(body: dict):
    """Build a day's nutrition/coaching from your profile plus the workout
    planned for that day.

    Body: {
        "profile": {...} | null,          # falls back to the saved profile
        "planned_workout": {...} | null,  # raw Garmin calendar item or
                                          # {"type": "...", "duration_min": N}
        "metrics": {...}                  # today's Garmin vitals (optional)
    }
    Macros adapt to the planned workout's intensity (recovery/endurance/
    threshold/vo2max).
    """
    data = dict(ENGINE_DEFAULTS)

    prof = body.get("profile")
    if prof:
        data.update(AthleteProfile.from_dict(prof).to_daily_inputs())
    else:
        saved = load_profile()
        if saved:
            data.update(saved.to_daily_inputs())

    data.update(body.get("metrics") or {})

    classified = None
    planned = body.get("planned_workout")
    if planned:
        classified = classify_planned_workout(planned)
        data["workout_type"] = classified["workout_type"]
        data["workout"] = {
            "duration_min": classified["duration_min"],
            "type": classified["workout_type"],
        }

    result = run_engines(data)
    if classified:
        result["planned_workout"] = classified
    return result


def _base_inputs(body: dict) -> dict:
    """Assemble engine inputs from defaults + profile + today's metrics."""
    data = dict(ENGINE_DEFAULTS)
    prof = body.get("profile")
    if prof:
        data.update(AthleteProfile.from_dict(prof).to_daily_inputs())
    else:
        saved = load_profile()
        if saved:
            data.update(saved.to_daily_inputs())
    data.update(body.get("metrics") or {})
    return data


@app.post("/week-plan")
def week_plan(body: dict):
    """Macro targets for a week of planned workouts.

    Body: {
        "profile": {...} | null,
        "planned_workouts": [ {raw Garmin item or {type, duration_min}}, ... ],
        "metrics": {...}
    }
    Each day's carbs follow that day's training intensity, on the calorie
    baseline from your profile. Once Garmin is connected, populate
    planned_workouts from GarminConnectClient.fetch_planned_workouts().
    """
    base = _base_inputs(body)

    days = []
    for pw in body.get("planned_workouts", []):
        classified = classify_planned_workout(pw)
        data = dict(base)
        data["workout_type"] = classified["workout_type"]
        data["workout"] = {
            "duration_min": classified["duration_min"],
            "type": classified["workout_type"],
        }
        kcal = calories(data)
        days.append(
            {
                "title": classified["title"],
                "date": classified["date"],
                "workout_type": classified["workout_type"],
                "duration_min": classified["duration_min"],
                "calories": kcal,
                "macros": macros(data, kcal),
                "fueling": fueling_plan(data["workout"]),
            }
        )

    return {"days": days}
