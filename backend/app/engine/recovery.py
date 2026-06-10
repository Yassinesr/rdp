def recovery_plan(g):
    if g["sleep_score"] < 60 or g["hrv_status"] == "unbalanced":
        return {
            "priority": "HIGH",
            "actions": [
                "Increase sleep opportunity",
                "Light mobility 10-15 min",
                "No intense training",
                "Add 30-60 min nap if possible"
            ]
        }

    return {
        "priority": "NORMAL",
        "actions": [
            "Light stretching",
            "Optional walk",
            "Foam rolling"
        ]
    }
