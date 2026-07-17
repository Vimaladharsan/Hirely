from app.services.skill_extraction_service import SkillExtractionService

service = SkillExtractionService()

text = """
python fastapi sql docker git linux machine learning
"""

skills = service.extract_skills(text)

print(skills)