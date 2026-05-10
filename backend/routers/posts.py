from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
import models
import schemas
from dependencies import verify_admin

router = APIRouter()

@router.get("/", response_model=List[schemas.PostResponse])
def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.is_public == True).offset(skip).limit(limit).all()
    return posts

@router.get("/admin", response_model=List[schemas.PostResponse])
def get_all_admin(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    posts = db.query(models.Post).offset(skip).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=schemas.PostResponse)
def get_post(post_id: UUID, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    
    return post

@router.post("/", response_model=schemas.PostResponse, status_code=status.HTTP_201_CREATED)
def create(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db),
    admin_email: str = Depends(verify_admin) 
):
    user = db.query(models.User).filter(models.User.email == admin_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Admin não encontrado. Faça login antes.")

    if not post.tag_ids or len(post.tag_ids) == 0:
        raise HTTPException(status_code=400, detail="Pelo menos uma tag é obrigatória.")

    new_post = models.Post(
        title=post.title,
        description=post.description,
        content=post.content,
        image=post.image,
        date=post.date,
        is_public=post.is_public,
        user_id=user.id
    )
    
    if post.tag_ids:
        tags = db.query(models.Tag).filter(models.Tag.id.in_(post.tag_ids)).all()
        new_post.tags = tags

    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.put("/{post_id}", response_model=schemas.PostResponse)
def update(
    post_id: UUID, 
    post_update: schemas.PostCreate, 
    db: Session = Depends(get_db),
    admin_email: str = Depends(verify_admin) 
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    
    if post_update.tag_ids is not None and len(post_update.tag_ids) == 0:
        raise HTTPException(status_code=400, detail="Pelo menos uma tag é obrigatória.")
    
    post.title = post_update.title
    post.description = post_update.description
    post.content = post_update.content
    post.image = post_update.image
    post.date = post_update.date
    post.is_public = post_update.is_public
    
    if post_update.tag_ids is not None:
        tags = db.query(models.Tag).filter(models.Tag.id.in_(post_update.tag_ids)).all()
        post.tags = tags

    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    post_id: UUID, 
    db: Session = Depends(get_db),
    admin_email: str = Depends(verify_admin)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    
    db.delete(post)
    db.commit()
