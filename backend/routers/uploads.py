from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import base64
from dependencies import verify_admin

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/")
async def upload_file(file: UploadFile = File(...), admin_email: str = Depends(verify_admin)):
    if not file:
        raise HTTPException(status_code=400, detail="Nenhum arquivo enviado.")
    
    content_type = file.content_type or "image/png"
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Apenas arquivos de imagem são permitidos.")
    
    file_bytes = await file.read()
    
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo muito grande. Máximo 5MB.")
    
    b64_data = base64.b64encode(file_bytes).decode("utf-8")
    data_url = f"data:{content_type};base64,{b64_data}"
        
    return {"url": data_url}
