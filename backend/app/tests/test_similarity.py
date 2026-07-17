from app.services.similarity_service import SimilarityService

service = SimilarityService()

resume = """
python fastapi sql docker git
"""

job = """
python fastapi sql docker aws git
"""

score = service.calculate_similarity(
    resume,
    job
)

print(score)