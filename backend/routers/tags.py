from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from dependencies import verify_admin
from database import get_db
import models
import schemas

router = APIRouter()

@router.post("/", response_model=schemas.TagResponse, status_code=status.HTTP_201_CREATED)
def create(tag: schemas.TagCreate, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    existing_tag = db.query(models.Tag).filter(models.Tag.name == tag.name).first()
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe uma tag com esse nome."
        )
    
    new_tag = models.Tag(name=tag.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

@router.get("/", response_model=List[schemas.TagResponse])
def get_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tags = db.query(models.Tag).offset(skip).limit(limit).all()
    return tags

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(tag_id: UUID, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag não encontrada."
        )
    
    db.delete(tag)
    db.commit()

