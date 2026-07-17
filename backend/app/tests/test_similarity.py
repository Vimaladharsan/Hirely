from app.services.similarity_service import SimilarityService


def test_calculate_similarity_identical_text():
    score = SimilarityService.calculate_similarity(
        "python fastapi sql", "python fastapi sql"
    )

    assert score == 100.0


def test_calculate_similarity_relevant_text():
    score = SimilarityService.calculate_similarity(
        "python fastapi sql docker git",
        "python fastapi sql docker aws git",
    )

    assert score > 50


def test_calculate_similarity_empty_text():
    assert SimilarityService.calculate_similarity("", "python") == 0.0
