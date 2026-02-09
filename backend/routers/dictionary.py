from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import math

from database import get_db
import models
import schemas
from dependencies import verify_admin 

router = APIRouter()

@router.post("/", response_model=schemas.DictionaryItemResponse, status_code=status.HTTP_201_CREATED)
def create(item: schemas.DictionaryItemCreate, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    existing_item = db.query(models.DictionaryItem).filter(models.DictionaryItem.term == item.term).first()
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este termo já existe no dicionário."
        )
    
    new_item = models.DictionaryItem(
        term=item.term,
        definition=item.definition,
        letter=item.letter
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=schemas.DictionaryPaginatedResponse)
def get_all(
    page: int = 1, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    total = db.query(models.DictionaryItem).count()
    items = db.query(models.DictionaryItem).offset(skip).limit(limit).all()
    total_pages = math.ceil(total / limit)

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": len(items),
        "pages": total_pages
    }

@router.get("/{item_id}", response_model=schemas.DictionaryItemResponse)
def get_by_id(item_id: UUID, db: Session = Depends(get_db)):
    item = db.query(models.DictionaryItem).filter(models.DictionaryItem.id == item_id).first()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Termo não encontrado."
        )
    return item

@router.put("/{item_id}", response_model=schemas.DictionaryItemResponse)
def update(item_id: UUID, item_update: schemas.DictionaryItemCreate, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    db_item = db.query(models.DictionaryItem).filter(models.DictionaryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Termo não encontrado."
        )
    
    if item_update.term != db_item.term:
        existing_term = db.query(models.DictionaryItem).filter(models.DictionaryItem.term == item_update.term).first()
        if existing_term:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe outro item com este termo."
            )

    db_item.term = item_update.term
    db_item.definition = item_update.definition
    db_item.letter = item_update.letter
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(item_id: UUID, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    db_item = db.query(models.DictionaryItem).filter(models.DictionaryItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Termo não encontrado."
        )
    
    db.delete(db_item)
    db.commit()
