from app.database.connection import engine
from app.database.database import Base

from app.models import job_model, resume_model, screening_model  # noqa: F401


def init_db():
    Base.metadata.create_all(bind=engine)
