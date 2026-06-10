def risk_check(g):
    flags = []

    if g["hrv"] < g["baseline_hrv"] * 0.85:
        flags.append("HRV suppression")

    if g["resting_hr"] > g["baseline_rhr"] + 6:
        flags.append("Elevated RHR")

    if g["sleep_debt_hours"] > 12:
        flags.append("High sleep debt")

    if flags:
        return {
            "risk": "ELEVATED",
            "flags": flags,
            "action": "reduce load by 20-40%"
        }

    return {"risk": "LOW"}
