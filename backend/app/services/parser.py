import fitz
from pathlib import Path


class ParserService:
    """
    Service for parsing resume files.
    Currently supports PDF resumes.
    """

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from a PDF file.

        Args:
            file_path (str): Path to the uploaded PDF.

        Returns:
            str: Extracted text.
        """

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        if path.suffix.lower() != ".pdf":
            raise ValueError("Only PDF files are supported.")

        text = ""

        try:
            document = fitz.open(file_path)

            for page in document:
                text += page.get_text()

            document.close()

            return text.strip()

        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")