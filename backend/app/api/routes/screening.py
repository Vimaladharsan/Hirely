import json

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.job_model import Job
from app.models.screening_model import ScreeningResult
from app.schemas.response_schema import AnalyzeResponse, CandidateResult
from app.services.ranking_service import RankingService
from app.services.screening_service import ScreeningService
from app.services.similarity_service import calculate_similarity
from app.utils.file_handler import FileHandler
from app.utils.logger import logger

router = APIRouter()


class ScreeningRequest(BaseModel):
    resume: str
    job_description: str


@router.post("/screen")
async def screen_resume(request: ScreeningRequest):
    score = calculate_similarity(request.resume, request.job_description)

    return {
        "similarity_score": score,
        "resume": request.resume[:100],
        "job_description": request.job_description[:100]
    }


def _to_candidate_result(record: ScreeningResult) -> CandidateResult:
    return CandidateResult(
        id=record.id,
        candidate_name=record.candidate_name,
        filename=record.filename,
        compatibility_score=record.compatibility_score,
        semantic_score=record.similarity_score,
        skill_score=record.skill_match_percentage,
        experience_score=record.experience_score,
        education_score=record.education_score,
        certification_score=record.certification_score,
        recommendation=record.recommendation,
        experience_years=record.experience_years,
        matched_skills=json.loads(record.matched_skills or "[]"),
        missing_skills=json.loads(record.missing_skills or "[]"),
        strengths=json.loads(record.strengths or "[]"),
        interview_questions=json.loads(record.interview_questions or "[]"),
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resumes(
    job_title: str = Form(...),
    company: str = Form(""),
    job_description: str = Form(...),
    resumes: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    if not resumes:
        raise HTTPException(status_code=400, detail="At least one resume file is required.")

    job = Job(title=job_title, company=company or None, description=job_description)
    db.add(job)
    db.commit()
    db.refresh(job)

    scored_candidates = []

    for resume_file in resumes:
        try:
            FileHandler.validate_file(resume_file)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=f"{resume_file.filename}: {exc}")

        file_path = FileHandler.save_file(resume_file)

        try:
            result = ScreeningService.screen_resume(
                file_path, job_description, resume_file.filename
            )
        except Exception as exc:
            logger.error(f"Failed to screen {resume_file.filename}: {exc}")
            raise HTTPException(
                status_code=422,
                detail=f"Could not process {resume_file.filename}: {exc}",
            )

        scored_candidates.append(result)

    ranked_candidates = RankingService.rank_candidates(scored_candidates)

    candidate_results = []

    for candidate in ranked_candidates:
        record = ScreeningResult(
            job_id=job.id,
            candidate_name=candidate["candidate_name"],
            filename=candidate["filename"],
            similarity_score=candidate["semantic_score"],
            skill_match_percentage=candidate["skill_score"],
            experience_score=candidate["experience_score"],
            education_score=candidate["education_score"],
            certification_score=candidate["certification_score"],
            compatibility_score=candidate["compatibility_score"],
            recommendation=candidate["recommendation"],
            experience_years=candidate["experience_years"],
            matched_skills=json.dumps(candidate["matched_skills"]),
            missing_skills=json.dumps(candidate["missing_skills"]),
            strengths=json.dumps(candidate["strengths"]),
            interview_questions=json.dumps(candidate["interview_questions"]),
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        candidate_results.append(_to_candidate_result(record))

    return AnalyzeResponse(
        job_id=job.id,
        job_title=job.title,
        candidates=candidate_results,
    )


@router.get("/results/{job_id}", response_model=AnalyzeResponse)
async def get_results(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    records = (
        db.query(ScreeningResult)
        .filter(ScreeningResult.job_id == job_id)
        .order_by(ScreeningResult.compatibility_score.desc())
        .all()
    )

    return AnalyzeResponse(
        job_id=job.id,
        job_title=job.title,
        candidates=[_to_candidate_result(record) for record in records],
    )
