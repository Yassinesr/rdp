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

## Garmin credentials

The Garmin Health API requires an approved developer program account. Once you
have OAuth credentials, save the token bundle where the sync daemon can read it
(default `./garmin_token.json`, or `secrets/garmin_token.json` for Docker):

```json
{ "access_token": "...", "refresh_token": "...", "expires_in": 3600 }
```

Configuration is environment-driven (see `backend/app/config.py`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./garmin_coach.db` | SQLAlchemy database URL |
| `GARMIN_TOKEN_FILE` | `./garmin_token.json` | OAuth token bundle location |
| `SYNC_INTERVAL_SECONDS` | `900` | Daemon polling interval |
| `GARMIN_USER_ID` | `user1` | User key for stored metrics |
| `OPENAI_API_KEY` | (unset) | Enables the optional AI coach-notes summary |

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
