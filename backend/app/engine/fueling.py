def fueling_plan(workout):
    duration = workout["duration_min"]

    if duration < 60:
        carbs_hr = 0
    elif duration < 120:
        carbs_hr = 60
    else:
        carbs_hr = 90

    total_carbs = (duration / 60) * carbs_hr

    return {
        "carbs_per_hour": carbs_hr,
        "total_carbs": total_carbs,
        "strategy": "gels + drink mix + bananas"
    }
