import re

SKILL_KEYWORDS = [
    # Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang",
    "rust", "php", "ruby", "scala", "kotlin", "swift", "r", "matlab",
    # Web / Frontend
    "react", "react.js", "angular", "vue", "next.js", "redux", "html", "css",
    "tailwind", "bootstrap", "sass", "webpack",
    # Backend
    "node.js", "express", "django", "flask", "fastapi", "spring", "spring boot",
    ".net", "graphql", "rest api", "microservices",
    # Data / Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle",
    "elasticsearch", "data analysis", "data science", "pandas", "numpy",
    "scikit-learn", "power bi", "tableau", "etl",
    # AI / ML
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "llm", "generative ai",
    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "ci/cd", "git", "github", "gitlab", "linux", "bash", "powershell",
    "ansible", "nginx",
    # Mobile
    "android", "ios", "flutter", "react native",
    # Practices
    "agile", "scrum", "unit testing", "system design", "object oriented programming",
]


class SkillExtractionService:
    """
    Extracts known technical skills mentioned in a block of text
    using keyword matching over a curated skill dictionary.
    """

    @staticmethod
    def extract_skills(text: str) -> list[str]:
        if not text:
            return []

        lowered = text.lower()
        found = []

        for skill in SKILL_KEYWORDS:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"

            if re.search(pattern, lowered):
                found.append(skill)

        return found


def extract_skills(text: str) -> list[str]:
    return SkillExtractionService.extract_skills(text)
