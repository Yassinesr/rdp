"""Personal Garmin data source backed by the unofficial garminconnect library.

Unlike the partner-only Garmin Health API (see garmin_client.py), this logs in
with a normal Garmin Connect account (email + password) and reads the same
internal API the Connect website uses. No developer approval required.

The client exposes the same fetch_sleep / fetch_hrv / fetch_activities
interface as GarminClient and returns the same normalized envelopes, so the
sync daemon and engines are unchanged.
"""

from datetime import date, datetime, timedelta, timezone

from .config import settings


def _epoch_ms_to_seconds(value):
    """Garmin Connect sleep timestamps are epoch milliseconds; the daemon's
    parse_ts treats bare numbers as epoch seconds, so convert here."""
    if value is None:
        return None
    return value / 1000.0


def map_sleep(raw):
    """Map a garminconnect get_sleep_data() payload to the sync envelope."""
    if not raw:
        return {"sleepData": []}

    dto = raw.get("dailySleepDTO") or {}
    start = dto.get("sleepStartTimestampGMT")
    end = dto.get("sleepEndTimestampGMT")
    if start is None:
        return {"sleepData": []}

    scores = dto.get("sleepScores") or {}
    overall = scores.get("overall") or {}
    score = overall.get("value", dto.get("sleepScore", 0)) or 0

    duration_sec = dto.get("sleepTimeSeconds") or 0

    return {
        "sleepData": [
            {
                "startTime": _epoch_ms_to_seconds(start),
                "endTime": _epoch_ms_to_seconds(end),
                "sleepScore": score,
                "duration": round(duration_sec / 60.0, 1),
            }
        ]
    }


def map_hrv(raw):
    """Map a garminconnect get_hrv_data() payload to the sync envelope."""
    if not raw:
        return {"hrvData": []}

    readings = raw.get("hrvReadings") or []
    out = []
    for r in readings:
        ts = r.get("readingTimeGMT")
        value = r.get("hrvValue")
        if ts is None or value is None:
            continue
        out.append({"timestamp": ts, "rmssd": value})

    return {"hrvData": out}


def map_activities(raw):
    """Map a garminconnect get_activities() list to the sync envelope."""
    if not raw:
        return {"activities": []}

    out = []
    for act in raw:
        start = act.get("startTimeGMT")
        if start is None:
            continue
        activity_type = (act.get("activityType") or {}).get("typeKey", "unknown")
        duration_sec = act.get("duration") or 0
        out.append(
            {
                "startTime": start,
                "activityType": activity_type,
                "duration": round(duration_sec / 60.0, 1),
                "calories": act.get("calories") or 0,
                "trainingLoad": act.get("activityTrainingLoad") or 0,
            }
        )

    return {"activities": out}


class GarminConnectClient:
    def __init__(self, email=None, password=None, tokenstore=None, lookback_days=2):
        self.email = email or settings.GARMIN_EMAIL
        self.password = password or settings.GARMIN_PASSWORD
        self.tokenstore = tokenstore or settings.GARMIN_TOKENSTORE
        self.lookback_days = lookback_days
        self._api = None

    def api(self):
        """Lazily authenticate. Reuses a cached token bundle when present and
        only falls back to an email/password login (then persists fresh
        tokens) when the cache is missing or expired."""
        if self._api is not None:
            return self._api

        from garminconnect import Garmin  # lazy: keep import optional

        try:
            api = Garmin()
            api.login(self.tokenstore)
        except Exception:
            if not self.email or not self.password:
                raise RuntimeError(
                    "No cached Garmin token and no GARMIN_EMAIL/GARMIN_PASSWORD set. "
                    "Provide credentials, or generate a token bundle once interactively."
                )
            api = Garmin(email=self.email, password=self.password)
            api.login()
            try:
                api.garth.dump(self.tokenstore)
            except Exception as e:
                print("Could not persist Garmin token bundle:", e)

        self._api = api
        return api

    def _dates(self):
        today = date.today()
        return [today - timedelta(days=i) for i in range(self.lookback_days)]

    def fetch_sleep(self):
        api = self.api()
        data = []
        for d in self._dates():
            raw = api.get_sleep_data(d.isoformat())
            data.extend(map_sleep(raw)["sleepData"])
        return {"sleepData": data}

    def fetch_hrv(self):
        api = self.api()
        data = []
        for d in self._dates():
            raw = api.get_hrv_data(d.isoformat())
            data.extend(map_hrv(raw)["hrvData"])
        return {"hrvData": data}

    def fetch_activities(self):
        api = self.api()
        start = (date.today() - timedelta(days=self.lookback_days)).isoformat()
        end = date.today().isoformat()
        try:
            raw = api.get_activities_by_date(start, end)
        except AttributeError:
            raw = api.get_activities(0, 20)
        return map_activities(raw)
