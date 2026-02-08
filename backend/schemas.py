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