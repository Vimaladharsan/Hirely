from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class SimilarityService:
    """
    Computes semantic-style similarity between a resume and a job
    description using TF-IDF weighted cosine similarity.
    """

    @staticmethod
    def calculate_similarity(resume: str, job_description: str) -> float:
        if not resume or not job_description:
            return 0.0

        vectorizer = TfidfVectorizer()

        vectors = vectorizer.fit_transform([resume, job_description])

        score = cosine_similarity(vectors[0], vectors[1])[0][0]

        return round(score * 100, 2)


def calculate_similarity(resume: str, job_description: str) -> float:
    return SimilarityService.calculate_similarity(resume, job_description)
