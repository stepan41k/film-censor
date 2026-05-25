from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class ReviewBase(BaseModel):
    movie_id: int
    rating: float = Field(..., ge=1, le=10)
    comment: str

class ReviewCreate(ReviewBase):
    pass

class UserInReview(BaseModel):
    username: str
    class Config:
        from_attributes = True

class Review(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    author: UserInReview 

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None