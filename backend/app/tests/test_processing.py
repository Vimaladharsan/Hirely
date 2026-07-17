from app.services.preprocessing import PreprocessingService


def test_clean_text_removes_noise():
    service = PreprocessingService()

    text = (
        "John Doe\n"
        "Email: john@gmail.com\n"
        "Experienced Python Developer with FastAPI and SQL.\n"
        "https://github.com/john"
    )

    result = service.clean_text(text)

    assert "john@gmail.com" not in result
    assert "github.com" not in result
    assert "python" in result


def test_clean_text_empty_string():
    service = PreprocessingService()

    assert service.clean_text("") == ""
