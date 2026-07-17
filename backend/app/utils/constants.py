import os

# Base Directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
PARSED_FOLDER = os.path.join(BASE_DIR, "parsed")

# Allowed File Types
ALLOWED_EXTENSIONS = {".pdf", ".docx"}

# Maximum File Size (5 MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Recommendation Thresholds
# Recalibrated for transformer-embedding semantic similarity, which has a
# higher baseline floor than TF-IDF (unrelated text still shares some
# embedding similarity, whereas TF-IDF gave near-zero overlap for
# unrelated vocabulary). Verified against real resumes: a strong,
# fully-matched ML candidate scored ~59, a partial-fit candidate ~44,
# and a completely unrelated resume (security guard) ~32 — thresholds
# below are set to separate those three cleanly.
STRONG_MATCH = 58
GOOD_MATCH = 45
AVERAGE_MATCH = 38