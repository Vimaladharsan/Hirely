import fitz

from app.services.parser import ParserService


def test_extract_text_from_pdf(tmp_path):
    pdf_path = tmp_path / "sample.pdf"

    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Hello Hirely")
    doc.save(str(pdf_path))
    doc.close()

    text = ParserService.extract_text(str(pdf_path))

    assert "Hello Hirely" in text


def test_extract_text_missing_file_raises():
    try:
        ParserService.extract_text("does_not_exist.pdf")
        assert False, "expected FileNotFoundError"
    except FileNotFoundError:
        pass
