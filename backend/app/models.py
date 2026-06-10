from sqlalchemy import Column, Integer, Float, String, DateTime, UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Sleep(Base):
    __tablename__ = "sleep"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    start = Column(DateTime)
    end = Column(DateTime)
    score = Column(Integer)
    duration_min = Column(Float)

    __table_args__ = (
        UniqueConstraint("user_id", "start"),
    )


class HRV(Base):
    __tablename__ = "hrv"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    timestamp = Column(DateTime)
    rmssd = Column(Float)

    __table_args__ = (
        UniqueConstraint("user_id", "timestamp"),
    )


class Activity(Base):
    __tablename__ = "activity"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    start = Column(DateTime)
    type = Column(String)
    duration = Column(Float)
    calories = Column(Float)
    load = Column(Float)

    __table_args__ = (
        UniqueConstraint("user_id", "start", "type"),
    )
