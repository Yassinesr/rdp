def compute_readiness(g):
    score = g["garmin_readiness"]

    # sleep impact
    if g["sleep_score"] < 60:
        score -= 15

    # HRV impact
    if g["hrv_status"] == "unbalanced":
        score -= 10

    # load fatigue
    if g["acute_load"] > g["chronic_load"] * 1.3:
        score -= 15

    if g["resting_hr"] > g["baseline_rhr"] + 5:
        score -= 10

    if score >= 80:
        state = "GREEN"
    elif score >= 60:
        state = "YELLOW"
    elif score >= 40:
        state = "ORANGE"
    else:
        state = "RED"

    return {"score": score, "state": state}
