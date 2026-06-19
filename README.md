# Garmin Coach

Adaptive cycling coach that turns your Garmin data (sleep, HRV, training load,
activities) into daily recommendations: readiness, calories, macros, ride
fueling, hydration, recovery, mobility, and overtraining risk warnings.

## Architecture

```
Garmin Health API
      │
      ▼
Sync Daemon (worker)        ← polling, OAuth refresh, retries, idempotent writes
      │
      ▼
PostgreSQL                  ← sleep / hrv / activity tables (deduplicated)
      │
      ▼
FastAPI Coach Engine        ← readiness, nutrition, fueling, recovery, risk
      │
      ▼
Next.js Dashboard
```

## Project layout

```
backend/
  app/
    main.py            FastAPI app (POST /daily)
    garmin_client.py   Garmin Health API client with retry + token refresh
    token_manager.py   OAuth token provider (file-backed storage)
    sync_daemon.py     Background sync worker (15-min cycle, idempotent)
    run_sync.py        Daemon entrypoint (python -m app.run_sync)
    db.py              SQLAlchemy session + upsert-safe writes
    models.py          Sleep / HRV / Activity tables with unique constraints
    ai_summary.py      Optional OpenAI coach-notes layer
    config.py          Env-driven settings
    engine/            readiness, nutrition, fueling, hydration,
                       recovery, mobility, risk
frontend/
  app/                 Next.js app router dashboard
docker-compose.yml     db + backend API + sync daemon + frontend
```

## Quick start

```bash
docker compose up --build
```

- API: http://localhost:8000 (interactive docs at `/docs`)
- Dashboard: http://localhost:3000

Without Docker:

```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# sync daemon (separate terminal)
python -m app.run_sync

# frontend
cd frontend
npm install
npm run dev
```

## Connecting Garmin

The sync daemon supports two data sources, selected with `GARMIN_SOURCE`.

### Default: personal Garmin Connect account (`GARMIN_SOURCE=connect`)

The Garmin **Health API** is a partner-only program that individuals generally
cannot get approved for. So by default the daemon uses
[`garminconnect`](https://github.com/cyberjunky/python-garmin-connect), which
logs in with your normal Garmin Connect email and password — the same
credentials as the app — and reads sleep, HRV, training load, and activities.
No developer approval needed.

```bash
export GARMIN_SOURCE=connect
export GARMIN_EMAIL="you@example.com"
export GARMIN_PASSWORD="..."
python -m app.run_sync
```

The first login caches a token bundle in `GARMIN_TOKENSTORE` (default
`./.garminconnect`) so later runs don't re-submit your password. If your
account uses MFA, generate that token bundle once interactively, then the
daemon reuses it.

> Unofficial library — fine for personal use, but it can break if Garmin
> changes their internal API, and it's a gray area under Garmin's ToS.

### Optional: partner Garmin Health API (`GARMIN_SOURCE=health`)

If you *do* have approved OAuth credentials, save the token bundle where the
daemon can read it (default `./garmin_token.json`, or `secrets/garmin_token.json`
for Docker) and set `GARMIN_SOURCE=health`:

```json
{ "access_token": "...", "refresh_token": "...", "expires_in": 3600 }
```

### Configuration

Settings resolve in this order: **environment variable → JSON config file →
default**. The JSON file lets you set your Garmin login once instead of
re-exporting environment variables in every terminal (handy on Windows, where
`$env:` vars don't persist between windows).

Copy `backend/config.example.json` to `backend/config.local.json` and fill it in:

```json
{
  "GARMIN_SOURCE": "connect",
  "GARMIN_EMAIL": "you@example.com",
  "GARMIN_PASSWORD": "your-garmin-password"
}
```

`config.local.json` is gitignored (it holds your password). Override the path
with the `CONFIG_FILE` env var if you want it elsewhere.

All available keys (see `backend/app/config.py`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./garmin_coach.db` | SQLAlchemy database URL |
| `GARMIN_SOURCE` | `connect` | `connect` (personal) or `health` (partner API) |
| `GARMIN_EMAIL` | (unset) | Garmin Connect login (connect source) |
| `GARMIN_PASSWORD` | (unset) | Garmin Connect password (connect source) |
| `GARMIN_TOKENSTORE` | `./.garminconnect` | Cached Connect token bundle dir |
| `GARMIN_TOKEN_FILE` | `./garmin_token.json` | Health API OAuth token bundle |
| `SYNC_INTERVAL_SECONDS` | `900` | Daemon polling interval |
| `GARMIN_USER_ID` | `user1` | User key for stored metrics |
| `PROFILE_FILE` | `./athlete_profile.json` | Your athlete profile (see below) |
| `OPENAI_API_KEY` | (unset) | Enables the optional AI coach-notes summary |

## Personalization & planned workouts

Garmin knows what your body does, not your goals, diet, or preferences. Fill in
[`ATHLETE_PROFILE.md`](./ATHLETE_PROFILE.md), save the answers as JSON (start from
[`profile.example.json`](./profile.example.json)) at `PROFILE_FILE`, and the app:

- computes your **calorie baseline (BMR)** from age/sex/height/weight
  (Mifflin–St Jeor) instead of a guessed number,
- uses your `baseline_rhr` / `baseline_hrv` as the reference points for the
  readiness and risk engines,
- factors diet, allergies, and dislikes into food/fueling suggestions.

```bash
curl http://localhost:8000/profile   # -> {"configured": true, "bmr": 2018, ...}
```

**Macros that follow your training day.** Once Garmin is connected, the client
can pull your upcoming scheduled workouts from the Garmin training calendar
(`GarminConnectClient.fetch_planned_workouts()`), classify each into an intensity
bucket, and set that day's carb target accordingly. The `/day-plan` endpoint ties
your profile and the planned workout together:

```bash
curl -X POST http://localhost:8000/day-plan -H "Content-Type: application/json" \
  -d '{"planned_workout": {"title": "VO2 Max 5x4", "estimatedDurationInSecs": 5400}}'
```

Carbohydrate scales with intensity — e.g. for a 107 kg rider: recovery ~321 g →
endurance ~535 g → threshold ~749 g → VO2max ~856 g, all on the same calorie
baseline. The `planned_workout` field accepts either a raw Garmin calendar item
or a simple `{"type": "...", "duration_min": N}`.

> The calendar fetch uses Garmin's undocumented internal endpoint, so it's
> best-effort and degrades to an empty list if Garmin changes it; the
> classification and macro logic are fully deterministic and tested.

## API example

```bash
curl -X POST http://localhost:8000/daily \
  -H "Content-Type: application/json" \
  -d '{
    "garmin_readiness": 78, "sleep_score": 72, "hrv_status": "balanced",
    "hrv": 62, "baseline_hrv": 65, "acute_load": 450, "chronic_load": 400,
    "resting_hr": 52, "baseline_rhr": 50, "sleep_debt_hours": 4,
    "bmr": 2100, "active_calories": 900, "recovery_modifier": 0,
    "weight_loss_target": 400, "weight": 107, "temp_c": 22,
    "workout_type": "endurance",
    "workout": {"duration_min": 120, "type": "endurance"}
  }'
```
