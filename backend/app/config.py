"""Application settings.

Values are resolved in this order (first match wins):
  1. an environment variable
  2. a key in the JSON config file (backend/config.local.json by default,
     or the path in the CONFIG_FILE env var)
  3. a built-in default

The JSON file means you set your Garmin login once instead of re-exporting
environment variables in every new terminal. See backend/config.example.json.
"""

import json
import os

# backend/ directory (parent of this app/ package).
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CONFIG_PATH = os.getenv("CONFIG_FILE", os.path.join(_BACKEND_DIR, "config.local.json"))


def _load_file_config():
    try:
        with open(_CONFIG_PATH) as f:
            data = json.load(f)
            print(f"Loaded config file: {_CONFIG_PATH}")
            return data
    except FileNotFoundError:
        return {}
    except Exception as e:
        print(f"WARNING: could not read config file {_CONFIG_PATH}: {e}")
        return {}


_FILE = _load_file_config()


def _get(key, default=None):
    """Environment variable first, then the JSON config file, then default."""
    if key in os.environ:
        return os.environ[key]
    return _FILE.get(key, default)


class Settings:
    DATABASE_URL = _get("DATABASE_URL", "sqlite:///./garmin_coach.db")
    GARMIN_API_BASE = _get(
        "GARMIN_API_BASE", "https://healthapi.garmin.com/wellness-api/rest"
    )
    TOKEN_FILE = _get("GARMIN_TOKEN_FILE", "./garmin_token.json")
    SYNC_INTERVAL_SECONDS = int(_get("SYNC_INTERVAL_SECONDS", "900"))
    USER_ID = _get("GARMIN_USER_ID", "user1")
    OPENAI_API_KEY = _get("OPENAI_API_KEY", "")

    # Data source: "connect" (personal account via garminconnect) or
    # "health" (partner-only Garmin Health API).
    GARMIN_SOURCE = _get("GARMIN_SOURCE", "connect")
    GARMIN_EMAIL = _get("GARMIN_EMAIL", "")
    GARMIN_PASSWORD = _get("GARMIN_PASSWORD", "")
    GARMIN_TOKENSTORE = _get("GARMIN_TOKENSTORE", "./.garminconnect")

    PROFILE_FILE = _get("PROFILE_FILE", "./athlete_profile.json")


settings = Settings()
