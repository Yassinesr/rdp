import time

import requests

from .config import settings


class GarminClient:
    def __init__(self, token_provider, base_url=None):
        self.token_provider = token_provider
        self.base_url = base_url or settings.GARMIN_API_BASE

    def headers(self):
        return {
            "Authorization": f"Bearer {self.token_provider.get_token()}"
        }

    def safe_get(self, url, retries=3):
        for i in range(retries):
            try:
                res = requests.get(url, headers=self.headers(), timeout=10)

                if res.status_code == 401:
                    self.token_provider.refresh_token()
                    continue

                res.raise_for_status()
                return res.json()

            except Exception as e:
                print(f"GET {url} failed (attempt {i + 1}/{retries}): {e}")
                time.sleep(2 ** i)

        return None

    def fetch_sleep(self):
        return self.safe_get(f"{self.base_url}/sleep")

    def fetch_hrv(self):
        return self.safe_get(f"{self.base_url}/hrv")

    def fetch_activities(self):
        return self.safe_get(f"{self.base_url}/activities")

    def fetch_training_load(self):
        return self.safe_get(f"{self.base_url}/load")

    def fetch_body_battery(self):
        return self.safe_get(f"{self.base_url}/bodyBattery")
