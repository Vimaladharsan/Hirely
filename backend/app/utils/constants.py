import os

# Base Directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
PARSED_FOLDER = os.path.join(BASE_DIR, "parsed")

# Allowed File Types
ALLOWED_EXTENSIONS = {".pdf"}

# Maximum File Size (5 MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Recommendation Thresholds
STRONG_MATCH = 80
GOOD_MATCH = 60
AVERAGE_MATCH = 40