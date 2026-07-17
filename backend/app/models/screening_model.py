from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime
)

from sqlalchemy.sql import func

from app.database.database import Base


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String(255),
        nullable=False
    )

    similarity_score = Column(
        Float,
        nullable=False
    )

    recommendation = Column(
        String(100),
        nullable=False
    )

    skill_match_percentage = Column(
        Float,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )