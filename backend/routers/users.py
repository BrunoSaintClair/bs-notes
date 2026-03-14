from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests

import jwt
from datetime import datetime, timedelta, timezone

import models
import schemas
from database import get_db

import os

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
JWT_SECRET = os.getenv("JWT_SECRET")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=3),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@router.post("/auth/google", response_model=schemas.LoginResponse)
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

        access_token = create_access_token(email)

        user_response = schemas.UserResponse.model_validate(user)
        user_response.is_admin = (email == ADMIN_EMAIL)

        return schemas.LoginResponse(
            user=user_response,
            access_token=access_token,
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token google inválido ou expirado"
        )