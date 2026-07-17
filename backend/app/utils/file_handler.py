import os
import shutil
import uuid

from fastapi import UploadFile

from app.utils.constants import (
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
    UPLOAD_FOLDER
)


class FileHandler:

    @staticmethod
    def validate_file(file: UploadFile):

        extension = os.path.splitext(file.filename)[1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError("Only PDF files are allowed.")

        return True

    @staticmethod
    def save_file(file: UploadFile):

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        extension = os.path.splitext(file.filename)[1]

        unique_name = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_name
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path

    @staticmethod
    def delete_file(file_path):

        if os.path.exists(file_path):
            os.remove(file_path)

            return True

        return False