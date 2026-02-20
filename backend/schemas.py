from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import List, Optional

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
    image: str
    date: str

class PostCreate(PostBase):
    tag_ids: List[UUID] = []

class PostResponse(PostBase):
    id: UUID
    views: int 
    user: Optional['UserResponse'] = None
    tags: List[TagResponse] = []

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    username: str
    email: str

class GoogleLoginRequest(BaseModel):
    token: str

class UserResponse(UserBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)
