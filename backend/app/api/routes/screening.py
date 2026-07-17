from fastapi import APIRouter
from app.services.similarity import calculate_similarity
from pydantic import BaseModel

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
