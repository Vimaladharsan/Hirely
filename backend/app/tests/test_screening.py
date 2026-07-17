from app.services.screening_service import ScreeningService

service = ScreeningService()

job_description = """
Looking for a Python Developer with FastAPI,
Docker, SQL, Git and Machine Learning.
"""

result = service.screen_resume(
    "uploads/sample_resume.pdf",
    job_description
)

print(result)