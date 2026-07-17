from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.parser import ParserService
from app.services.preprocessing import clean_text
from app.utils.file_handler import FileHandler

router = APIRouter()


@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    try:
        FileHandler.validate_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    file_path = FileHandler.save_file(file)
    text = ParserService.extract_text(file_path)

    return {
        "filename": file.filename,
        "text": text[:1000]
    }


@router.post("/clean")
async def clean_resume(file: UploadFile = File(...)):
    try:
        FileHandler.validate_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    file_path = FileHandler.save_file(file)
    text = ParserService.extract_text(file_path)
    cleaned = clean_text(text)

    return {
        "cleaned_text": cleaned[:1000]
    }
