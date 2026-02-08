from fastapi import FastAPI
from database import engine
import models
from routers import users_router, posts_router, tags_router, dictionary_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(posts_router, prefix="/posts", tags=["Posts"])
app.include_router(tags_router, prefix="/tags", tags=["Tags"])
app.include_router(dictionary_router, prefix="/dictionary", tags=["Dictionary"])

@app.get("/")
def read_root():
    return {"Hello": "World", "Database": "Connected"}
