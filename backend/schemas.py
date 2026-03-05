from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from typing import List, Optional
from datetime import datetime

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class DictionaryItemBase(BaseModel):
    term: str
    definition: str
    letter: str

class DictionaryItemCreate(DictionaryItemBase):
    pass

class DictionaryItemResponse(DictionaryItemBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class DictionaryPaginatedResponse(BaseModel):
    items: List[DictionaryItemResponse]
    total: int
    page: int
    size: int
    pages: int

class PostBase(BaseModel):
    title: str
    description: str
    content: str
    image: str = ""
    date: str
    is_public: bool = True

class PostCreate(PostBase):
    tag_ids: List[UUID] = []

class PostResponse(PostBase):
    id: UUID
    views: int = 0
    tags: List[TagResponse] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class UserBase(BaseModel):
    username: str
    email: str

class GoogleLoginRequest(BaseModel):
    token: str

class UserResponse(UserBase):
    id: UUID
    is_admin: bool = False
    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str


class ReactionCreate(BaseModel):
    type: str

class ReactionResponse(BaseModel):
    id: UUID
    post_id: UUID
    type: str
    user_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReactionSummary(BaseModel):
    likes: int
    dislikes: int

class UserReactionCheck(BaseModel):
    type: Optional[str] = None

class CommentCreate(BaseModel):
    content: str = Field(..., max_length=300)

class CommentResponse(BaseModel):
    id: UUID
    post_id: UUID
    content: str
    user_id: UUID
    username: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
