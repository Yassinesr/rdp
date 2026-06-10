from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .engine.readiness import compute_readiness
from .engine.nutrition import calories, macros
from .engine.fueling import fueling_plan
from .engine.recovery import recovery_plan
from .engine.hydration import hydration
from .engine.mobility import mobility_plan
from .engine.risk import risk_check
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
    }

    summary = explain(result)
    if summary:
        result["summary"] = summary

    return result
