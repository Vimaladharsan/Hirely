import re
import spacy

_nlp = None


def _get_nlp():
    global _nlp

    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")

    return _nlp


class PreprocessingService:
    """
    Service for preprocessing resume text.
    """

    def __init__(self):
        self.nlp = _get_nlp()

    def clean_text(self, text: str) -> str:
        """
        Clean and preprocess resume text.

        Steps:
        1. Lowercase conversion
        2. Remove URLs
        3. Remove email addresses
        4. Remove phone numbers
        5. Remove special characters
        6. Tokenization
        7. Stop word removal
        8. Lemmatization

        Args:
            text (str): Raw resume text

        Returns:
            str: Cleaned text
        """

        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove URLs
        text = re.sub(r"http\S+|www\S+", " ", text)

        # Remove email addresses
        text = re.sub(r"\S+@\S+", " ", text)

        # Remove phone numbers
        text = re.sub(r"\+?\d[\d\s\-]{8,}\d", " ", text)

        # Remove special characters
        text = re.sub(r"[^a-zA-Z\s]", " ", text)

        # Remove extra spaces
        text = re.sub(r"\s+", " ", text).strip()

        # NLP Processing
        doc = self.nlp(text)

        tokens = []

        for token in doc:

            if (
                token.is_stop
                or token.is_punct
                or token.is_space
            ):
                continue

            lemma = token.lemma_.strip()

            if len(lemma) > 1:
                tokens.append(lemma)

        return " ".join(tokens)


_service = None


def clean_text(text: str) -> str:
    global _service

    if _service is None:
        _service = PreprocessingService()

    return _service.clean_text(text)