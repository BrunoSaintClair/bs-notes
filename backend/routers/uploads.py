from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
import shutil
import os
import uuid
from dependencies import verify_admin

router = APIRouter()

@router.post("/")
def upload_file(request: Request, file: UploadFile = File(...), admin_email: str = Depends(verify_admin)):
    if not file:
        raise HTTPException(status_code=400, detail="Nenhum arquivo enviado.")
    
    ext = file.filename.split('.')[-1] if '.' in file.filename else ''
    filename = f"{uuid.uuid4()}.{ext}" if ext else str(uuid.uuid4())
    
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    filepath = os.path.join(upload_dir, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"{request.base_url}uploads/{filename}"}
