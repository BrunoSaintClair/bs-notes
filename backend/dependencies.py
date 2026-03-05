from fastapi import Header, HTTPException, status
import jwt
import os
from dotenv import load_dotenv
from database import get_db
from fastapi import Depends

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

def verify_admin(Authorization: str = Header(None)):
    if not Authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Faltando header."
        )

    try:
        token = Authorization.split(" ")[1]
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("sub")

        if email != ADMIN_EMAIL:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não está autorizado a fazer essa ação."
            )
        
        return email

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado."
        )
    except (jwt.InvalidTokenError, IndexError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido."
        )

def verify_user(Authorization: str = Header(None), db = Depends(get_db)):
    if not Authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Faltando header."
        )

    try:
        token = Authorization.split(" ")[1]
        
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("sub")

        from models import User
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado.")
        
        return user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado."
        )
    except (jwt.InvalidTokenError, IndexError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido."
        )