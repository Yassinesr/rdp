import os


class Settings:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./garmin_coach.db",
    )
    GARMIN_API_BASE = os.getenv(
        "GARMIN_API_BASE",
        "https://healthapi.garmin.com/wellness-api/rest",
    )
    TOKEN_FILE = os.getenv("GARMIN_TOKEN_FILE", "./garmin_token.json")
    SYNC_INTERVAL_SECONDS = int(os.getenv("SYNC_INTERVAL_SECONDS", "900"))
    USER_ID = os.getenv("GARMIN_USER_ID", "user1")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

    # Data source: "connect" (personal account via garminconnect) or
    # "health" (partner-only Garmin Health API).
    GARMIN_SOURCE = os.getenv("GARMIN_SOURCE", "connect")
    GARMIN_EMAIL = os.getenv("GARMIN_EMAIL", "")
    GARMIN_PASSWORD = os.getenv("GARMIN_PASSWORD", "")
    GARMIN_TOKENSTORE = os.getenv("GARMIN_TOKENSTORE", "./.garminconnect")

    PROFILE_FILE = os.getenv("PROFILE_FILE", "./athlete_profile.json")


settings = Settings()
