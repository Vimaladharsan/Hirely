import re
from pathlib import Path

from app.services.parser import ParserService
from app.services.similarity_service import SimilarityService
from app.services.skill_extraction_service import SkillExtractionService
from app.utils.constants import STRONG_MATCH, GOOD_MATCH, AVERAGE_MATCH

EDUCATION_KEYWORDS = [
    "bachelor", "b.tech", "btech", "b.e", "b.sc", "bsc",
    "master", "m.tech", "mtech", "m.sc", "msc", "mba",
    "phd", "ph.d", "degree", "university", "college",
]

CERTIFICATION_KEYWORDS = [
    "certified", "certification", "certificate",
    "project", "projects",
]

QUESTION_BANK = {
    "python": "Can you walk us through a challenging problem you solved using Python?",
    "java": "How do you manage memory and performance in large Java applications?",
    "javascript": "Explain closures and how you've used them in real projects.",
    "react": "How do you manage state and performance in a large React application?",
    "react.js": "How do you manage state and performance in a large React application?",
    "node.js": "How would you design a scalable REST API using Node.js?",
    "sql": "How would you optimize a slow-running SQL query?",
    "aws": "Describe a time you deployed or scaled an application on AWS.",
    "docker": "Walk us through how you'd containerize a multi-service application.",
    "kubernetes": "How do you handle rolling deployments and scaling in Kubernetes?",
    "machine learning": "Describe an ML model you built end-to-end, from data to deployment.",
    "django": "How does Django's ORM compare to writing raw SQL, and when would you use each?",
    "fastapi": "How would you structure a production-grade FastAPI service?",
    "git": "How do you handle merge conflicts in a fast-moving team?",
}

GENERIC_QUESTIONS = [
    "Describe your most challenging project and how you approached it.",
    "How do you prioritize tasks when working under tight deadlines?",
    "Tell us about a time you had to learn a new technology quickly.",
]


def _candidate_name_from_filename(filename: str) -> str:
    stem = Path(filename).stem
    stem = re.sub(r"[_\-]+", " ", stem)
    stem = re.sub(r"\s+", " ", stem).strip()

    return stem.title() if stem else "Candidate"


def _extract_years(text: str) -> float:
    if not text:
        return 0.0

    matches = re.findall(
        r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)",
        text,
        flags=re.IGNORECASE,
    )

    if not matches:
        return 0.0

    return max(float(m) for m in matches)


def _has_any_keyword(text: str, keywords: list[str]) -> bool:
    lowered = text.lower()

    return any(keyword in lowered for keyword in keywords)


def _recommendation_for(score: float) -> str:
    if score >= STRONG_MATCH:
        return "Strong Match"
    elif score >= GOOD_MATCH:
        return "Good Match"
    elif score >= AVERAGE_MATCH:
        return "Average Match"

    return "Weak Match"


def _build_strengths(
    matched_skills: list[str],
    semantic_raw: float,
    experience_years: float,
    has_certs: bool,
) -> list[str]:
    strengths = []

    if matched_skills:
        top = ", ".join(s.title() for s in matched_skills[:5])
        strengths.append(f"Strong alignment on key skills: {top}")

    if semantic_raw >= 60:
        strengths.append("Resume content closely matches the job description's context and requirements")

    if experience_years >= 1:
        strengths.append(f"Has approximately {experience_years:g} years of relevant experience")

    if has_certs:
        strengths.append("Demonstrates hands-on project experience or relevant certifications")

    if not strengths:
        strengths.append("Resume was successfully parsed, but shows limited overlap with this job description")

    return strengths


def _build_questions(matched_skills: list[str], missing_skills: list[str]) -> list[str]:
    questions = []

    for skill in matched_skills[:3]:
        question = QUESTION_BANK.get(skill)

        if question:
            questions.append(question)

    if missing_skills:
        gap = missing_skills[0].title()
        questions.append(f"This role also involves {gap}. What is your experience or familiarity with it?")

    for question in GENERIC_QUESTIONS:
        if len(questions) >= 5:
            break

        questions.append(question)

    return questions[:5]


class ScreeningService:
    """
    Orchestrates the full resume-screening pipeline for a single
    resume against a job description: parsing, semantic similarity,
    skill matching, experience/education/certification heuristics,
    and a weighted Candidate Compatibility Score.
    """

    @staticmethod
    def screen_resume(
        file_path: str,
        job_description: str,
        original_filename: str | None = None,
    ) -> dict:
        display_name = original_filename or Path(file_path).name

        raw_text = ParserService.extract_text(file_path)

        # Transformer embeddings understand natural language, so we feed
        # the raw resume / JD text (grammar and stop words intact) rather
        # than the lemmatized form the old TF-IDF path required.
        semantic_raw = SimilarityService.calculate_similarity(
            raw_text, job_description
        )

        resume_skills = SkillExtractionService.extract_skills(raw_text)
        jd_skills = SkillExtractionService.extract_skills(job_description)

        matched_skills = [s for s in jd_skills if s in resume_skills]
        missing_skills = [s for s in jd_skills if s not in resume_skills]

        skill_score = (
            round((len(matched_skills) / len(jd_skills)) * 20, 2)
            if jd_skills
            else 20.0
        )

        experience_years = _extract_years(raw_text)
        required_years = _extract_years(job_description)

        if required_years > 0:
            experience_score = round(min(experience_years / required_years, 1.0) * 15, 2)
        else:
            experience_score = 15.0 if experience_years >= 1 else 7.5

        has_education = _has_any_keyword(raw_text, EDUCATION_KEYWORDS)
        education_score = 10.0 if has_education else 4.0

        has_certs = _has_any_keyword(raw_text, CERTIFICATION_KEYWORDS)
        certification_score = 5.0 if has_certs else 2.0

        semantic_score = round(semantic_raw / 100 * 50, 2)

        compatibility_score = round(
            min(
                semantic_score
                + skill_score
                + experience_score
                + education_score
                + certification_score,
                100,
            ),
            2,
        )

        return {
            "candidate_name": _candidate_name_from_filename(display_name),
            "filename": display_name,
            "raw_text": raw_text,
            "compatibility_score": compatibility_score,
            "semantic_score": semantic_score,
            "skill_score": skill_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "certification_score": certification_score,
            "recommendation": _recommendation_for(compatibility_score),
            "experience_years": experience_years,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "strengths": _build_strengths(
                matched_skills, semantic_raw, experience_years, has_certs
            ),
            "interview_questions": _build_questions(matched_skills, missing_skills),
        }
