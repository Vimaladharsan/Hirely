from sentence_transformers import SentenceTransformer, util

# Compact, fast, CPU-friendly sentence embedding model (384-dim).
# Downloaded from the Hugging Face hub on first use, then cached locally.
_MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def _get_model():
    """Lazily load and cache the embedding model (like the spaCy pipeline)."""
    global _model

    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)

    return _model


class SimilarityService:
    """
    Computes semantic similarity between a resume and a job description
    using transformer sentence embeddings (all-MiniLM-L6-v2) and cosine
    similarity.

    Unlike TF-IDF, this understands meaning rather than word overlap —
    "led a team" and "management experience" score as related even with
    no shared words. Feed it raw natural-language text (not lemmatized)
    for best results.
    """

    @staticmethod
    def calculate_similarity(resume: str, job_description: str) -> float:
        if not resume or not job_description:
            return 0.0

        model = _get_model()

        embeddings = model.encode(
            [resume, job_description],
            normalize_embeddings=True,
        )

        score = util.cos_sim(embeddings[0], embeddings[1]).item()

        # Cosine similarity is in [-1, 1]; clamp negatives to 0 so the
        # downstream weighting never goes below zero.
        score = max(0.0, score)

        return round(score * 100, 2)


def calculate_similarity(resume: str, job_description: str) -> float:
    return SimilarityService.calculate_similarity(resume, job_description)
