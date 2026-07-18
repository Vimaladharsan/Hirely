import asyncio
import json
import os

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.database import get_db
from app.models.job_model import Job
from app.models.screening_model import ScreeningResult
from app.models.user_model import User
from app.schemas.response_schema import AnalyzeResponse, CandidateResult
from app.services.ranking_service import RankingService
from app.services.screening_service import ScreeningService
from app.services.similarity_service import calculate_similarity
from app.utils.constants import UPLOAD_FOLDER
from app.utils.file_handler import FileHandler
from app.utils.logger import logger

router = APIRouter()

MEDIA_TYPES = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


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
        insight_source=record.insight_source or "rule_based",
    )


def _process_resume_sync(resume_file: UploadFile, job_description: str) -> dict:
    """
    Runs the full synchronous per-resume pipeline (validate, save,
    parse, embed, Gemini call). Designed to run inside a worker thread
    so multiple resumes' network-bound work (the embedding model and
    the Gemini call) can overlap instead of blocking the event loop
    one resume at a time.
    """
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

    result["file_path"] = file_path
    return result


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resumes(
    job_title: str = Form(...),
    company: str = Form(""),
    job_description: str = Form(...),
    resumes: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not resumes:
        raise HTTPException(status_code=400, detail="At least one resume file is required.")

    job = Job(
        user_id=current_user.id,
        title=job_title,
        company=company or None,
        description=job_description,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Process every resume concurrently in worker threads — each one's
    # Gemini call and embedding inference can take several seconds, and
    # doing them one-by-one made a batch of resumes feel like it had
    # hung. Running them in parallel bounds total time to roughly the
    # slowest single resume instead of the sum of all of them.
    scored_candidates = list(
        await asyncio.gather(
            *(
                asyncio.to_thread(_process_resume_sync, resume_file, job_description)
                for resume_file in resumes
            )
        )
    )

    ranked_candidates = RankingService.rank_candidates(scored_candidates)

    candidate_results = []

    for candidate in ranked_candidates:
        record = ScreeningResult(
            job_id=job.id,
            candidate_name=candidate["candidate_name"],
            filename=candidate["filename"],
            file_path=candidate["file_path"],
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
            insight_source=candidate.get("insight_source", "rule_based"),
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


@router.get("/jobs")
async def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .order_by(Job.created_at.desc())
        .all()
    )

    return [
        {
            "job_id": job.id,
            "title": job.title,
            "company": job.company,
            "created_at": job.created_at,
        }
        for job in jobs
    ]


@router.get("/results/{job_id}", response_model=AnalyzeResponse)
async def get_results(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id, Job.user_id == current_user.id)
        .first()
    )

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


@router.get("/resume/{candidate_id}")
async def get_resume_file(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(ScreeningResult)
        .join(Job, Job.id == ScreeningResult.job_id)
        .filter(ScreeningResult.id == candidate_id, Job.user_id == current_user.id)
        .first()
    )

    if not record or not record.file_path:
        raise HTTPException(status_code=404, detail="Resume file not found")

    # Confirm the stored path is still inside the upload folder before
    # serving it, in case the file was moved or deleted since upload.
    resolved_upload_folder = os.path.realpath(UPLOAD_FOLDER)
    resolved_path = os.path.realpath(record.file_path)

    if (
        not resolved_path.startswith(resolved_upload_folder)
        or not os.path.isfile(resolved_path)
    ):
        raise HTTPException(status_code=404, detail="Resume file not found")

    extension = os.path.splitext(resolved_path)[1].lower()
    media_type = MEDIA_TYPES.get(extension, "application/octet-stream")

    return FileResponse(
        resolved_path,
        media_type=media_type,
        filename=record.filename,
        content_disposition_type="inline",
    )
