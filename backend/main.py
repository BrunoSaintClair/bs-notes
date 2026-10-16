from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from routers import users_router, posts_router, tags_router, dictionary_router, feedback_router
from routers.uploads import router as uploads_router
import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if FRONTEND_URL:
    origins.extend([url.strip() for url in FRONTEND_URL.split(",") if url.strip()])

import models
from database import engine

# Cria as tabelas no banco de dados automaticamente se ainda não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(posts_router, prefix="/posts", tags=["Posts"])
app.include_router(tags_router, prefix="/tags", tags=["Tags"])
app.include_router(dictionary_router, prefix="/dictionary", tags=["Dictionary"])
app.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])
app.include_router(uploads_router, prefix="/upload", tags=["Uploads"])

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "Database": "Connected"}

# Servir Frontend se pasta static existir (gerada pelo estágio do frontend no Docker)
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))
if os.path.exists(static_dir):
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Ignora rotas da API para não interceptar erros 404
        api_prefixes = ("users", "posts", "tags", "dictionary", "feedback", "upload", "health", "docs", "openapi.json", "redoc")
        if any(full_path == prefix or full_path.startswith(f"{prefix}/") for prefix in api_prefixes):
            raise HTTPException(status_code=404, detail="Endpoint não encontrado")

        safe_path = os.path.abspath(os.path.join(static_dir, full_path))
        if os.path.commonpath([static_dir, safe_path]) == static_dir and os.path.isfile(safe_path):
            return FileResponse(safe_path)

        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend não construído")
else:
    @app.get("/")
    def read_root():
        return {"Hello": "World", "Database": "Connected"}

