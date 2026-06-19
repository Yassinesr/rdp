# Athlete Profile — tell the coach about you

Garmin tracks what your body *does* (sleep, HRV, load, heart rate). It doesn't
know your **goals, diet, preferences, or constraints**. This questionnaire fills
that gap. Answer what you can — anything left blank just falls back to a sensible
default.

**How to use it:** answer the questions below, then copy your answers into a
JSON file (start from [`profile.example.json`](./profile.example.json)) and save
it as `athlete_profile.json` in the backend folder (or set `PROFILE_FILE`). The
app loads it automatically — for example, your **calorie baseline (BMR) is then
calculated from your age, sex, height, and weight** instead of a guessed number,
and your **planned workout for the day sets your carb target**.

The JSON field name is shown in `code` after each question.

---

## 1. The basics (used to compute your calorie baseline)

These four drive the BMR formula (Mifflin–St Jeor), so they matter most.

- **Age?** (years) → `age`
- **Sex?** (male / female — needed for the BMR equation) → `sex`
- **Height?** (cm) → `height_cm`
- **Current weight?** (kg) → `weight_kg`
- **Goal weight?** (kg, if you have one) → `target_weight_kg`

> Example from earlier in your project: a 107 kg → 89 kg path. Put 107 in
> `weight_kg` and 89 in `target_weight_kg`.

## 2. Your goals (Garmin has no idea what you're training for)

- **Primary goal?** weight loss / performance / both / maintain → `goal`
- **Target event or race?** (name, or leave blank) → `target_event`
- **Target date?** (YYYY-MM-DD) → `target_date`
- **Daily calorie deficit you want?** (kcal/day — e.g. 300–500 for steady fat
  loss; 0 if maintaining) → `weight_loss_target_kcal`

## 3. Cycling profile

- **FTP?** (watts) → `ftp_watts`
- **Max heart rate?** (bpm) → `max_hr`
- **Baseline resting HR?** (bpm — your normal morning RHR) → `baseline_rhr`
- **Baseline HRV?** (ms — your typical overnight HRV) → `baseline_hrv`
- **Typical training volume?** (hours/week) → `weekly_hours`
- **Experience level?** beginner / intermediate / advanced → `experience`

> `baseline_rhr` and `baseline_hrv` feed the readiness and risk engines — they're
> the reference points used to detect "you're more fatigued than usual."

## 4. Nutrition (the stuff Garmin will never have)

- **Diet type?** omnivore / vegetarian / vegan / pescatarian → `diet_type`
- **Allergies or intolerances?** (list — e.g. lactose, gluten, nuts) →
  `allergies`
- **Foods you dislike / won't eat?** (list) → `dislikes`
- **Meals per day you prefer?** → `meals_per_day`
- **Caffeine OK?** (true / false — for fueling suggestions) → `caffeine_ok`
- **Sensitive stomach during hard efforts?** (true / false — if true, fueling
  advice leans toward gentler carbs) → `gi_sensitive`

## 5. Lifestyle

- **Daily activity outside training?** This becomes a multiplier on your BMR:
  - sedentary desk job → `1.2`
  - lightly active → `1.4`
  - on your feet / manual work → `1.6`
  - → `activity_factor`
- **Typical sleep?** (hours/night) → `typical_sleep_hours`
- **Units?** metric / imperial → `units`

---

## What each answer changes

| Your answer | What it drives |
| --- | --- |
| age, sex, height, weight | Calorie baseline (BMR), so every day's calorie target |
| `weight_loss_target_kcal` | Size of the daily deficit applied to calories |
| `baseline_rhr`, `baseline_hrv` | Readiness score and overtraining-risk flags |
| planned workout (from Garmin calendar) | Carb target for the day (recovery → low, VO2max → high) |
| `diet_type`, `allergies`, `dislikes`, `gi_sensitive` | Food and fueling suggestions |
| `goal`, `target_event`, `target_date` | Overall framing and future taper logic |

Once saved, check it loaded correctly:

```bash
curl http://localhost:8000/profile
```

You should see `"configured": true` and your computed `bmr`.
