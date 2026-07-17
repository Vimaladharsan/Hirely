from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(
    resume,
    job_description
):

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform(
        [resume, job_description]
    )

    score = cosine_similarity(
        vectors[0],
        vectors[1]
    )[0][0]

    return round(
        score * 100,
        2
    )