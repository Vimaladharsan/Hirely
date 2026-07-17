from fastapi import APIRouter
from app.api.routes import health, upload, resume, screening

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])
api_router.include_router(screening.router, prefix="/screening", tags=["Screening"])
