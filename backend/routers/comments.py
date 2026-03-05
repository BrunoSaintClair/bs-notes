from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
import models
import schemas
from dependencies import verify_admin, verify_user

router = APIRouter()


@router.post("/{post_id}/comments", response_model=schemas.CommentResponse, status_code=201)
def create_comment(post_id: UUID, comment: schemas.CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(verify_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    if len(comment.content.strip()) == 0:
        raise HTTPException(status_code=400, detail="O comentário não pode ser vazio.")

    new_comment = models.Comment(
        post_id=post_id,
        user=current_user,
        content=comment.content[:300]
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@router.get("/{post_id}/comments/mine", response_model=list[schemas.CommentResponse])
def list_my_comments(post_id: UUID, db: Session = Depends(get_db), current_user: models.User = Depends(verify_user)):
    return db.query(models.Comment).filter(
        models.Comment.post_id == post_id,
        models.Comment.user_id == current_user.id
    ).order_by(models.Comment.created_at.desc()).all()


@router.get("/{post_id}/comments", response_model=list[schemas.CommentResponse])
def list_comments(post_id: UUID, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    return db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).order_by(models.Comment.created_at.desc()).all()
