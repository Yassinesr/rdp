"""Athlete profile — the things Garmin can't know about you (goals, diet,
preferences) plus the physiology needed to compute a calorie baseline.

Fill in ATHLETE_PROFILE.md, save the answers as JSON (see profile.example.json)
at PROFILE_FILE, and the engines use it: BMR is derived from age/sex/height/
weight via Mifflin-St Jeor instead of being a hardcoded number.
"""

import json
import os
from dataclasses import asdict, dataclass, field, fields
from typing import List, Optional

from .config import settings


@dataclass
class AthleteProfile:
    name: str = ""
    age: Optional[int] = None
    sex: str = ""                      # "male" / "female" (for BMR formula)
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    target_weight_kg: Optional[float] = None

    # Cycling / physiology
    ftp_watts: Optional[int] = None
    max_hr: Optional[int] = None
    baseline_rhr: Optional[int] = None
    baseline_hrv: Optional[float] = None
    weekly_hours: Optional[float] = None
    experience: str = ""               # beginner / intermediate / advanced

    # Goals
    goal: str = ""                     # weight_loss / performance / both / maintain
    target_event: str = ""
    target_date: str = ""
    weight_loss_target_kcal: int = 0   # desired daily calorie deficit

    # Nutrition (Garmin has none of this)
    diet_type: str = ""                # omnivore / vegetarian / vegan / pescatarian
    allergies: List[str] = field(default_factory=list)
    dislikes: List[str] = field(default_factory=list)
    meals_per_day: Optional[int] = None
    caffeine_ok: Optional[bool] = None
    gi_sensitive: Optional[bool] = None  # sensitive stomach during hard efforts

    # Lifestyle
    activity_factor: float = 1.4       # non-exercise daily activity multiplier
    typical_sleep_hours: Optional[float] = None
    units: str = "metric"

    @classmethod
    def from_dict(cls, data: dict) -> "AthleteProfile":
        names = {f.name for f in fields(cls)}
        return cls(**{k: v for k, v in data.items() if k in names})

    def mifflin_bmr(self):
        """Mifflin-St Jeor resting metabolic rate (kcal/day)."""
        if not (self.weight_kg and self.height_cm and self.age and self.sex):
            return None
        base = 10 * self.weight_kg + 6.25 * self.height_cm - 5 * self.age
        offset = 5 if self.sex.lower().startswith("m") else -161
        return round(base + offset)

    def to_daily_inputs(self) -> dict:
        """Map profile fields onto the keys the coaching engines consume."""
        out = {}
        bmr = self.mifflin_bmr()
        if bmr:
            out["bmr"] = bmr
        if self.weight_kg:
            out["weight"] = self.weight_kg
        if self.baseline_rhr:
            out["baseline_rhr"] = self.baseline_rhr
        if self.baseline_hrv:
            out["baseline_hrv"] = self.baseline_hrv
        if self.weight_loss_target_kcal:
            out["weight_loss_target"] = self.weight_loss_target_kcal
        return out


def load_profile(path=None):
    path = path or settings.PROFILE_FILE
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return AthleteProfile.from_dict(json.load(f))


def profile_summary(profile: AthleteProfile) -> dict:
    return {"configured": True, "bmr": profile.mifflin_bmr(), "profile": asdict(profile)}
