from pathlib import Path

import fitz
from docx import Document


class ParserService:
    """
    Service for parsing resume files.
    Supports PDF and DOCX resumes.
    """

    @staticmethod
    def extract_text(file_path: str) -> str:
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        suffix = path.suffix.lower()

        if suffix == ".pdf":
            return ParserService._extract_pdf(file_path)
        elif suffix == ".docx":
            return ParserService._extract_docx(file_path)

        raise ValueError("Only PDF and DOCX files are supported.")

    @staticmethod
    def _extract_pdf(file_path: str) -> str:
        try:
            document = fitz.open(file_path)
            text = ""

            for page in document:
                text += page.get_text()

            document.close()

            return text.strip()

        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")

    @staticmethod
    def _extract_docx(file_path: str) -> str:
        try:
            document = Document(file_path)
            paragraphs = [p.text for p in document.paragraphs]

            return "\n".join(paragraphs).strip()

        except Exception as e:
            raise Exception(f"Error parsing DOCX: {str(e)}")


def extract_text(file_path: str) -> str:
    return ParserService.extract_text(file_path)
