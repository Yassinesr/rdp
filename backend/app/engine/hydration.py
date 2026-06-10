def hydration(g):
    base = 35 * g["weight"]  # ml

    sweat_factor = g.get("temp_c", 20) / 20

    total = base * sweat_factor

    sodium = 800 * (total / 1000)

    return {
        "fluids_ml": total,
        "sodium_mg": sodium
    }
