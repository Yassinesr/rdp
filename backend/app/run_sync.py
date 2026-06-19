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
    client = make_client()
    db = DB(session=make_session())

    daemon = GarminSyncDaemon(client, db)
    print(f"Garmin sync daemon started (source={settings.GARMIN_SOURCE}).")
    daemon.run_forever()


if __name__ == "__main__":
    main()
