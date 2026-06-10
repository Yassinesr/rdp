from .db import DB, make_session
from .garmin_client import GarminClient
from .sync_daemon import GarminSyncDaemon
from .token_manager import FileTokenStorage, TokenProvider


def main():
    token_provider = TokenProvider(storage=FileTokenStorage())

    client = GarminClient(token_provider)
    db = DB(session=make_session())

    daemon = GarminSyncDaemon(client, db)
    print("Garmin sync daemon started.")
    daemon.run_forever()


if __name__ == "__main__":
    main()
