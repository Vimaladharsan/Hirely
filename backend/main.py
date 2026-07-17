from fastapi import FastAPI, UploadFile, File
from preprocessing import clean_text
from parser import extract_text
import os

app = FastAPI()

UPLOAD_DIR = "../uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {
        "filename": file.filename,
        "status": "uploaded"
    }

@app.post("/parse")
async def parse_resume(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text(file_path)

    return {
        "filename": file.filename,
        "text": text[:1000]
    }
@app.post("/clean")
async def clean_resume(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text(file_path)

    cleaned = clean_text(text)

    return {
        "cleaned_text": cleaned[:1000]
    }