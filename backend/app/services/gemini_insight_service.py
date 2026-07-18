import json
import os
import threading

from dotenv import load_dotenv

from app.utils.logger import logger

# The key lives in backend/gemini_api.env (gitignored). Loaded once at
# import time; if the file or key is missing, GEMINI_API_KEY is simply
# None and every call below falls back to the rule-based insights.
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "gemini_api.env"))

_GEMINI_MODEL = "gemini-flash-latest"
_client = None
_client_init_attempted = False
_client_lock = threading.Lock()


def _get_client():
    """Lazily create and cache the Gemini client. Returns None if no
    API key is configured or the SDK fails to initialize, so callers
    can fall back cleanly instead of crashing the screening pipeline.
    Thread-safe (double-checked locking) since resumes are screened
    concurrently — see similarity_service._get_model for the same
    pattern and why it matters."""
    global _client, _client_init_attempted

    if _client_init_attempted:
        return _client

    with _client_lock:
        if _client_init_attempted:
            return _client

        _client_init_attempted = True

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            logger.info("GEMINI_API_KEY not set — using rule-based insights.")
            return None

        try:
            from google import genai

            _client = genai.Client(api_key=api_key)
        except Exception as exc:
            logger.error(f"Failed to initialize Gemini client: {exc}")
            _client = None

        return _client


def is_available() -> bool:
    return _get_client() is not None


_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "strengths": {
            "type": "array",
            "items": {"type": "string"},
        },
        "interview_questions": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": ["strengths", "interview_questions"],
}

_PROMPT_TEMPLATE = """You are an expert technical recruiter assistant. Analyze this candidate against a job description.

Rules:
- 2 to 4 "strengths": specific, evidence-based observations tied to the resume content (not generic praise).
- Exactly 5 "interview_questions": probe both the candidate's demonstrated strengths AND the listed skill gaps.
- Keep every string under 220 characters.
- Do not invent skills or experience not present in the resume text below.

JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME TEXT:
{resume_text}

MATCHED SKILLS: {matched_skills}
MISSING SKILLS: {missing_skills}
COMPATIBILITY SCORE: {compatibility_score}/100 ({recommendation})
"""


class GeminiInsightService:
    """
    Generates candidate strengths and interview questions with Gemini,
    grounded in the actual resume text and score breakdown. Callers
    should always have a rule-based fallback ready — this returns None
    on any failure (missing key, network error, malformed response)
    rather than raising, so the screening pipeline never breaks because
    an LLM call failed.
    """

    @staticmethod
    def generate_insights(
        resume_text: str,
        job_description: str,
        matched_skills: list[str],
        missing_skills: list[str],
        compatibility_score: float,
        recommendation: str,
    ) -> dict | None:
        client = _get_client()

        if client is None:
            return None

        prompt = _PROMPT_TEMPLATE.format(
            job_description=job_description[:3000],
            resume_text=resume_text[:6000],
            matched_skills=", ".join(matched_skills) or "none",
            missing_skills=", ".join(missing_skills) or "none",
            compatibility_score=compatibility_score,
            recommendation=recommendation,
        )

        try:
            response = client.models.generate_content(
                model=_GEMINI_MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": _RESPONSE_SCHEMA,
                    "temperature": 0.4,
                },
            )

            data = json.loads(response.text)

            strengths = [str(s) for s in data.get("strengths", [])][:4]
            questions = [str(q) for q in data.get("interview_questions", [])][:5]

            if not strengths or not questions:
                return None

            return {"strengths": strengths, "interview_questions": questions}

        except Exception as exc:
            logger.error(f"Gemini insight generation failed: {exc}")
            return None
