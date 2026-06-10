def mobility_plan(g):
    workout_type = g.get("workout_type", "endurance")

    if workout_type in ("threshold", "vo2max"):
        return {
            "duration_min": 20,
            "focus": [
                "Hip flexor opener",
                "Thoracic spine rotation",
                "Glute activation",
                "Quad + hamstring dynamic stretch"
            ]
        }

    if workout_type == "recovery":
        return {
            "duration_min": 15,
            "focus": [
                "Foam rolling (quads, calves, back)",
                "Gentle hamstring stretch",
                "Neck + shoulder release"
            ]
        }

    return {
        "duration_min": 10,
        "focus": [
            "Hip mobility circuit",
            "Lower back decompression",
            "Calf + ankle mobility"
        ]
    }
