import time
from datetime import datetime, timezone

from .config import settings


def parse_ts(value):
    """Garmin returns either ISO-8601 strings or epoch seconds."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, tz=timezone.utc).replace(tzinfo=None)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00")).replace(tzinfo=None)


def _is_rate_limited(error):
    """Garmin/garth surface IP rate limiting as HTTP 429."""
    text = str(error).lower()
    return "429" in text or "rate limit" in text or "too many" in text


class GarminSyncDaemon:
    def __init__(
        self,
        client,
        db,
        user_id=None,
        interval=None,
        error_backoff=60,
        rate_limit_backoff=1800,
        max_backoff=21600,
    ):
        self.client = client
        self.db = db
        self.user_id = user_id or settings.USER_ID
        self.interval = interval or settings.SYNC_INTERVAL_SECONDS
        # Backoff tuning (seconds): generic transient errors start small,
        # rate limiting (429) starts much higher, both capped at max_backoff.
        self.error_backoff = error_backoff
        self.rate_limit_backoff = rate_limit_backoff
        self.max_backoff = max_backoff

    def _backoff_seconds(self, error, failures):
        base = self.rate_limit_backoff if _is_rate_limited(error) else self.error_backoff
        # Exponential growth on consecutive failures, capped.
        return min(base * (2 ** (failures - 1)), self.max_backoff)

    def run_forever(self):
        failures = 0
        while True:
            try:
                self.sync_all()
            except Exception as e:
                failures += 1
                wait = self._backoff_seconds(e, failures)
                kind = "RATE LIMITED" if _is_rate_limited(e) else "SYNC ERROR"
                mins = round(wait / 60, 1)
                print(f"{kind} (failure #{failures}): {e} -> backing off {mins} min")
                time.sleep(wait)
                continue

            # Success: reset the failure streak and poll on the normal cadence.
            failures = 0
            time.sleep(self.interval)

    def sync_all(self):
        self.sync_sleep()
        self.sync_hrv()
        self.sync_activities()

    def sync_sleep(self):
        data = self.client.fetch_sleep()
        if not data:
            return

        for entry in data.get("sleepData", []):
            self.db.upsert_sleep({
                "user_id": self.user_id,
                "start": parse_ts(entry["startTime"]),
                "end": parse_ts(entry["endTime"]),
                "score": entry.get("sleepScore", 0),
                "duration_min": entry.get("duration", 0)
            })

    def sync_hrv(self):
        data = self.client.fetch_hrv()
        if not data:
            return

        for entry in data.get("hrvData", []):
            self.db.upsert_hrv({
                "user_id": self.user_id,
                "timestamp": parse_ts(entry["timestamp"]),
                "rmssd": entry["rmssd"]
            })

    def sync_activities(self):
        data = self.client.fetch_activities()
        if not data:
            return

        for act in data.get("activities", []):
            self.db.upsert_activity({
                "user_id": self.user_id,
                "start": parse_ts(act["startTime"]),
                "type": act["activityType"],
                "duration": act["duration"],
                "calories": act["calories"],
                "load": act.get("trainingLoad", 0)
            })
