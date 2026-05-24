from pydantic import BaseModel

class ReviewBase(BaseModel):
    movie_id: int
    username: str
    rating: float
    comment: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int

    class Config:
        from_attributes = True 