from app.services.similarity_service import SimilarityService


def test_identical_text_scores_high():
    score = SimilarityService.calculate_similarity(
        "python fastapi sql developer", "python fastapi sql developer"
    )
    # Embeddings of identical text are ~identical vectors → ~100.
    assert score > 95


def test_semantically_related_beats_unrelated():
    resume = "Experienced backend engineer who led a team building REST APIs."
    related_jd = "Looking for a backend developer with leadership and API experience."
    unrelated_jd = "Seeking a pastry chef skilled in baking bread and cakes."

    related = SimilarityService.calculate_similarity(resume, related_jd)
    unrelated = SimilarityService.calculate_similarity(resume, unrelated_jd)

    assert related > unrelated


def test_empty_text_returns_zero():
    assert SimilarityService.calculate_similarity("", "python") == 0.0
