from fastapi import APIRouter, UploadFile, File, HTTPException

from app.utils.file_handler import FileHandler

router = APIRouter()


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        FileHandler.validate_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    FileHandler.save_file(file)

    return {
        "filename": file.filename,
        "status": "uploaded"
    }
