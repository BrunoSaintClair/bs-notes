from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    origins.append(FRONTEND_URL)

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

@app.get("/")
def read_root():
    return {"Hello": "World", "Database": "Connected"}
