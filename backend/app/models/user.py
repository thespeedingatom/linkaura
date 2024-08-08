from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserInDB(UserBase):
    uid: str
    is_premium: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

class User(UserInDB):
    pass

class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    display_name: Optional[str] = None
    is_premium: bool