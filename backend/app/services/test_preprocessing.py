from app.services.preprocessing import PreprocessingService

service = PreprocessingService()

text = """
John Doe

Email: john@gmail.com

Phone: +91 9876543210

Experienced Python Developer with FastAPI and SQL.

https://github.com/john
"""

result = service.clean_text(text)

print(result)