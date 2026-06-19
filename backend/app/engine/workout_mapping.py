"""Classify a planned Garmin workout into the intensity buckets the nutrition
engine understands, so macros adapt to what you're actually training that day.

Garmin calendar/workout items carry a title, sport type, description, and an
estimated duration. We map those onto: recovery / endurance / threshold /
vo2max — the same keys engine/nutrition.py uses to scale carbohydrate.
"""

RECOVERY = "recovery"
ENDURANCE = "endurance"
THRESHOLD = "threshold"
VO2MAX = "vo2max"

# Checked in order; first keyword hit wins. "recovery" is matched before the
# quality buckets so an explicit easy day isn't mistaken for intervals.
_RULES = [
    (RECOVERY, ["recovery", "active recovery", "easy", "shake out", "shakeout", "rest day", "spin"]),
    (VO2MAX, ["vo2", "v02", "anaerobic", "sprint", "hiit", "max effort", "neuromuscular"]),
    (THRESHOLD, ["threshold", "ftp", "tempo", "sweet spot", "sweetspot", "lactate", "race pace", "sub-threshold"]),
    (ENDURANCE, ["endurance", "base", "long ride", "long run", "zone 2", "zone2", "z2", "aerobic", "steady"]),
]

_DURATION_KEYS = (
    "estimatedDurationInSecs",
    "estimatedDurationSecs",
    "estimatedDuration",
    "durationSecs",
    "duration",
)

_TEXT_KEYS = (
    "title",
    "workoutName",
    "name",
    "description",
    "sportType",
    "sportTypeKey",
    "workoutType",
)


def _duration_min(item):
    for k in _DURATION_KEYS:
        v = item.get(k)
        if v:
            # Heuristic: large numbers are seconds, small ones already minutes.
            return round(v / 60) if v > 600 else round(v)
    if item.get("duration_min"):
        return round(item["duration_min"])
    return 60  # sensible default when Garmin gives no estimate


def classify_planned_workout(item):
    """Return a normalized planned-workout dict from a raw Garmin item."""
    text = " ".join(str(item.get(k, "")) for k in _TEXT_KEYS).lower()

    workout_type = ENDURANCE  # default for unlabeled / group rides
    for label, keywords in _RULES:
        if any(kw in text for kw in keywords):
            workout_type = label
            break

    return {
        "workout_type": workout_type,
        "duration_min": _duration_min(item),
        "title": item.get("title") or item.get("workoutName") or item.get("name") or workout_type,
        "date": item.get("date") or item.get("scheduledDate"),
    }
