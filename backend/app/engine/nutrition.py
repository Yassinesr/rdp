def calories(g):
    return (
        g["bmr"]
        + g["active_calories"]
        + g.get("recovery_modifier", 0)
        - g.get("weight_loss_target", 0)
    )


def macros(g, calories):
    protein = 2.1 * g["weight"]

    if g["workout_type"] == "recovery":
        carbs = 3 * g["weight"]
    elif g["workout_type"] == "endurance":
        carbs = 5 * g["weight"]
    elif g["workout_type"] == "threshold":
        carbs = 7 * g["weight"]
    elif g["workout_type"] == "vo2max":
        carbs = 8 * g["weight"]
    else:
        carbs = 4 * g["weight"]

    fat = (calories - (protein * 4 + carbs * 4)) / 9

    return {
        "protein_g": protein,
        "carbs_g": carbs,
        "fat_g": max(fat, 50)
    }
