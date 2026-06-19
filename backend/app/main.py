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
from .ai_summary import explain

app = FastAPI(title="Garmin Coach")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/daily")
def daily(data: dict):
    readiness = compute_readiness(data)

    kcal = calories(data)
    macro = macros(data, kcal)

    result = {
        "readiness": readiness,
        "calories": kcal,
        "macros": macro,
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
