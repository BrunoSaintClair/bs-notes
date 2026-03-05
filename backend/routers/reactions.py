from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
import models
import schemas
from dependencies import verify_admin, verify_user

router = APIRouter()


@router.post("/{post_id}/reactions", response_model=schemas.UserReactionCheck)
def toggle_reaction(post_id: UUID, reaction: schemas.ReactionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(verify_user)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    if reaction.type not in ("like", "dislike"):
        raise HTTPException(status_code=400, detail="Tipo de reação inválido.")

    existing = db.query(models.Reaction).filter(
        models.Reaction.post_id == post_id,
        models.Reaction.user_id == current_user.id
    ).first()

    if existing:
        if existing.type == reaction.type:
            db.delete(existing)
            db.commit()
            return schemas.UserReactionCheck(type=None)
        else:
            existing.type = reaction.type
            db.commit()
            return schemas.UserReactionCheck(type=reaction.type)
    else:
        new_reaction = models.Reaction(
            post_id=post_id,
            type=reaction.type,
            user_id=current_user.id
        )
        db.add(new_reaction)
        db.commit()
        return schemas.UserReactionCheck(type=reaction.type)


@router.get("/{post_id}/reactions/summary", response_model=schemas.ReactionSummary)
def get_reaction_summary(post_id: UUID, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    likes = db.query(models.Reaction).filter(
        models.Reaction.post_id == post_id,
        models.Reaction.type == "like"
    ).count()
    dislikes = db.query(models.Reaction).filter(
        models.Reaction.post_id == post_id,
        models.Reaction.type == "dislike"
    ).count()
    return schemas.ReactionSummary(likes=likes, dislikes=dislikes)


@router.get("/{post_id}/reactions/check", response_model=schemas.UserReactionCheck)
def check_reaction(post_id: UUID, db: Session = Depends(get_db), current_user: models.User = Depends(verify_user)):
    reaction = db.query(models.Reaction).filter(
        models.Reaction.post_id == post_id,
        models.Reaction.user_id == current_user.id
    ).first()
    return schemas.UserReactionCheck(type=reaction.type if reaction else None)


@router.get("/{post_id}/reactions", response_model=list[schemas.ReactionResponse])
def list_reactions(post_id: UUID, db: Session = Depends(get_db), admin_email: str = Depends(verify_admin)):
    return db.query(models.Reaction).filter(models.Reaction.post_id == post_id).all()
