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


class GarminSyncDaemon:
    def __init__(self, client, db, user_id=None, interval=None):
        self.client = client
        self.db = db
        self.user_id = user_id or settings.USER_ID
        self.interval = interval or settings.SYNC_INTERVAL_SECONDS

    def run_forever(self):
        while True:
            try:
                self.sync_all()
            except Exception as e:
                print("SYNC ERROR:", e)

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
