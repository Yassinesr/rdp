import json
import os
import time

from .config import settings


class FileTokenStorage:
    """Stores the Garmin OAuth token bundle as a JSON file.

    Expected file shape:
        {"access_token": "...", "refresh_token": "...", "expires_in": 3600}
    """

    def __init__(self, path=None):
        self.path = path or settings.TOKEN_FILE

    def load(self):
        if not os.path.exists(self.path):
            raise FileNotFoundError(
                f"Garmin token file not found at {self.path}. "
                "Complete the OAuth flow and save the token bundle there."
            )
        with open(self.path) as f:
            return json.load(f)

    def save(self, data):
        with open(self.path, "w") as f:
            json.dump(data, f)


class TokenProvider:
    def __init__(self, storage):
        self.storage = storage
        self.token = None
        self.expiry = 0

    def get_token(self):
        if not self.token or time.time() > self.expiry:
            self.refresh_token()
        return self.token

    def refresh_token(self):
        data = self.storage.load()

        # Placeholder for the full OAuth refresh flow: exchange
        # data["refresh_token"] against Garmin's token endpoint,
        # then persist the new bundle via self.storage.save(...).
        self.token = data["access_token"]
        self.expiry = time.time() + data.get("expires_in", 3500)
