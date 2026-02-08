from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests

import models
import schemas
from database import get_db

import os
from dotenv import load_dotenv

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()


@router.post("/auth/google", response_model=schemas.UserResponse)
def login_with_google(request: schemas.GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(
            request.token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        email = id_info.get('email')
        google_id = id_info.get('sub')
        name = id_info.get('name') or email.split('@')[0]

        if not email:
            raise HTTPException(status_code=400, detail="Token do google inválido: Email não encontrado")

        user = db.query(models.User).filter(models.User.email == email).first()

        if user:
            user.google_id = google_id
            db.commit()
            db.refresh(user)
        else:
            user = models.User(
                email=email,
                username=name,
                google_id=google_id,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return user

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token google inválido ou expirado"
        )
    