from sqlalchemy.orm import declarative_base

from app.database.connection import SessionLocal, engine

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
