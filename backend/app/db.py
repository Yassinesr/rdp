from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import settings
from .models import Base, Sleep, HRV, Activity


def make_session():
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()


class DB:
    def __init__(self, session: Session):
        self.session = session

    def upsert_sleep(self, data):
        obj = self.session.query(Sleep).filter_by(
            user_id=data["user_id"],
            start=data["start"]
        ).first()

        if obj:
            return

        self.session.add(Sleep(**data))
        self.session.commit()

    def upsert_hrv(self, data):
        obj = self.session.query(HRV).filter_by(
            user_id=data["user_id"],
            timestamp=data["timestamp"]
        ).first()

        if obj:
            return

        self.session.add(HRV(**data))
        self.session.commit()

    def upsert_activity(self, data):
        obj = self.session.query(Activity).filter_by(
            user_id=data["user_id"],
            start=data["start"],
            type=data["type"]
        ).first()

        if obj:
            return

        self.session.add(Activity(**data))
        self.session.commit()
