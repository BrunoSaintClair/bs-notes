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
