import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.utils.constants import BASE_DIR

DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'hirely.db')}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
