from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Text,
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

    job_id = Column(
        Integer,
        nullable=True,
        index=True
    )

    candidate_name = Column(
        String(255),
        nullable=False
    )

    filename = Column(
        String(255),
        nullable=False
    )

    similarity_score = Column(
        Float,
        nullable=False
    )

    skill_match_percentage = Column(
        Float,
        nullable=False
    )

    experience_score = Column(
        Float,
        nullable=False,
        default=0
    )

    education_score = Column(
        Float,
        nullable=False,
        default=0
    )

    certification_score = Column(
        Float,
        nullable=False,
        default=0
    )

    compatibility_score = Column(
        Float,
        nullable=False
    )

    recommendation = Column(
        String(100),
        nullable=False
    )

    experience_years = Column(
        Float,
        nullable=True
    )

    matched_skills = Column(
        Text,
        nullable=True
    )

    missing_skills = Column(
        Text,
        nullable=True
    )

    strengths = Column(
        Text,
        nullable=True
    )

    interview_questions = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
