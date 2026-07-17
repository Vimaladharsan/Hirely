from app.services.preprocessing_service import PreprocessingService

service = PreprocessingService()

text = """
John Doe
Experienced Python Developer with FastAPI, SQL and Docker.
"""

result = service.clean_text(text)

print(result)