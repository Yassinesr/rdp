"""Training-load analysis based on the acute:chronic workload ratio (ACWR).

ACWR = acute load (~last 7 days) / chronic load (~last 28 days). Sports-science
consensus puts the "sweet spot" around 0.8-1.3: below it fitness fades
(detraining), well above it injury/illness risk climbs. This engine reports
where you sit and — the part that matters when load *falls* — how to safely
build acute load back into the optimal band.
"""

# Boundaries of the ACWR zones.
FLOOR = 0.8        # below this: load too low, detraining
CEILING = 1.3      # above this: load climbing fast
DANGER = 1.5       # above this: spike / elevated risk

# Visual scale used by the frontend gauge.
SCALE_MIN = 0.5
SCALE_MAX = 1.75


def _gauge_pct(ratio):
    pct = (ratio - SCALE_MIN) / (SCALE_MAX - SCALE_MIN) * 100
    return max(0, min(100, round(pct)))


def training_load(g):
    acute = g.get("acute_load")
    chronic = g.get("chronic_load")

    if not acute or not chronic:
        return {
            "status": "UNKNOWN",
            "ratio": None,
            "message": "Need both acute and chronic load to assess training balance.",
            "recommendations": [],
        }

    ratio = round(acute / chronic, 2)
    optimal_low = round(FLOOR * chronic)
    optimal_high = round(CEILING * chronic)

    if ratio < FLOOR:
        status = "DETRAINING"
        deficit = optimal_low - acute
        # A safe weekly build is ~5-10% of current load; translate the deficit
        # into a per-session ask so it isn't crammed into one ride.
        weekly_step = max(round(0.08 * acute), 1)
        recommendations = [
            "Acute load is below the sweet spot — fitness will slowly fade if it stays here.",
            f"Target ~{optimal_low}-{optimal_high} acute load; you're short by about {deficit} points.",
            f"Build gradually: add roughly {weekly_step} load/week (~5-10%), not all at once.",
            "Best lever: add one or two Zone 2 endurance rides (45-90 min) this week.",
            "Keep one quality session (threshold or VO2) so you don't lose top-end fitness.",
            "Re-check in a week — once the ratio is back near 1.0, hold steady.",
        ]
    elif ratio <= CEILING:
        status = "OPTIMAL"
        recommendations = [
            "Load is in the sweet spot (0.8-1.3) — keep the current rhythm.",
            f"Stay within ~{optimal_low}-{optimal_high} acute load to maintain fitness.",
            "Progress fitness by nudging load up only ~5-10% per week.",
        ]
    elif ratio <= DANGER:
        status = "HIGH"
        recommendations = [
            "Load is climbing fast — hold steady and avoid adding more this week.",
            "Prioritise sleep, fuelling, and recovery so the body absorbs the work.",
            f"Let acute load drift back toward {optimal_high} before building again.",
        ]
    else:
        status = "DANGER"
        recommendations = [
            "Acute load is spiking well above chronic — elevated injury/illness risk.",
            f"Reduce toward {optimal_high} or below; insert an easy or full rest day.",
            "Avoid back-to-back hard sessions until the ratio settles under 1.3.",
        ]

    return {
        "status": status,
        "ratio": ratio,
        "acute": acute,
        "chronic": chronic,
        "optimal_low": optimal_low,
        "optimal_high": optimal_high,
        "gauge_pct": _gauge_pct(ratio),
        "recommendations": recommendations,
    }
