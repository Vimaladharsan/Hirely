from app.services.skill_extraction_service import SkillExtractionService


def test_extract_skills_finds_known_keywords():
    text = "python fastapi sql docker git linux machine learning"

    skills = SkillExtractionService.extract_skills(text)

    assert "python" in skills
    assert "fastapi" in skills
    assert "machine learning" in skills


def test_extract_skills_empty_text():
    assert SkillExtractionService.extract_skills("") == []
