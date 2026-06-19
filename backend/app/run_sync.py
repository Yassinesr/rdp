import sys
import traceback

from .config import settings
from .db import DB, make_session
from .garmin_client import GarminClient
from .garmin_connect_client import GarminConnectClient
from .sync_daemon import GarminSyncDaemon
from .token_manager import FileTokenStorage, TokenProvider


def make_client():
    """Pick the data source based on GARMIN_SOURCE.

    - "connect": personal Garmin Connect account (no developer approval)
    - "health":  partner-only Garmin Health API
    """
    if settings.GARMIN_SOURCE == "health":
        return GarminClient(TokenProvider(storage=FileTokenStorage()))
    return GarminConnectClient()


def main():
    # Print immediately (flushed) so the window always shows something, even
    # if a later step fails.
    print("Starting Garmin sync daemon...", flush=True)
    print(f"  source   = {settings.GARMIN_SOURCE}", flush=True)
    print(f"  database = {settings.DATABASE_URL}", flush=True)

    if settings.GARMIN_SOURCE == "connect" and not settings.GARMIN_EMAIL:
        print(
            "  WARNING: GARMIN_EMAIL is not set. In PowerShell run:\n"
            '    $env:GARMIN_EMAIL = "you@example.com"\n'
            '    $env:GARMIN_PASSWORD = "your-password"\n'
            "  in THIS window, then re-run the daemon.",
            flush=True,
        )

    try:
        client = make_client()
        db = DB(session=make_session())
    except Exception:
        print("\nFATAL: the daemon could not start:\n", flush=True)
        traceback.print_exc()
        # Keep the window open so the error is readable when double-clicked.
        input("\nPress Enter to close...")
        sys.exit(1)

    daemon = GarminSyncDaemon(client, db)
    print(
        f"Garmin sync daemon started (source={settings.GARMIN_SOURCE}). "
        "Polling — press Ctrl-C to stop.",
        flush=True,
    )
    daemon.run_forever()


if __name__ == "__main__":
    main()
