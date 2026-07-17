from app.services.parser_service import ParserService

text = ParserService.extract_text("uploads/sample_resume.pdf")

print(text)