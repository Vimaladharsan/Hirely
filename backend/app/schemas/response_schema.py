from pydantic import BaseModel


class CandidateResult(BaseModel):
    id: int
    candidate_name: str
    filename: str
    compatibility_score: float
    semantic_score: float
    skill_score: float
    experience_score: float
    education_score: float
    certification_score: float
    recommendation: str
    experience_years: float | None = None
    matched_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    interview_questions: list[str]
    insight_source: str = "rule_based"


class AnalyzeResponse(BaseModel):
    job_id: int
    job_title: str
    candidates: list[CandidateResult]
