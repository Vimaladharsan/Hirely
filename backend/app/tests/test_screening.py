import fitz

from app.services.screening_service import ScreeningService


def test_screen_resume_scores_within_range(tmp_path):
    pdf_path = tmp_path / "resume.pdf"

    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (72, 72),
        "Experienced Python Developer with FastAPI, Docker, SQL and Git. "
        "3 years experience. Bachelor degree in Computer Science.",
    )
    doc.save(str(pdf_path))
    doc.close()

    job_description = (
        "Looking for a Python Developer with FastAPI, Docker, SQL, "
        "Git and Machine Learning. Requires 2+ years experience."
    )

    result = ScreeningService.screen_resume(str(pdf_path), job_description)

    assert 0 <= result["compatibility_score"] <= 100
    assert "python" in result["matched_skills"]
    assert "machine learning" in result["missing_skills"]
    assert result["recommendation"] in {
        "Strong Match",
        "Good Match",
        "Average Match",
        "Weak Match",
    }
