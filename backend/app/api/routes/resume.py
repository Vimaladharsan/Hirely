from fastapi import APIRouter, UploadFile, File
from app.services.preprocessing import clean_text
from app.services.parser import extract_text
import os

router = APIRouter()

UPLOAD_DIR = "../uploads"

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    text = extract_text(file_path)
    
    return {
        "filename": file.filename,
        "text": text[:1000]
    }

@router.post("/clean")
async def clean_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    text = extract_text(file_path)
    cleaned = clean_text(text)
    
    return {
        "cleaned_text": cleaned[:1000]
    }
