from pydantic import BaseModel

# Базовая схема для общих полей
class ReviewBase(BaseModel):
    movie_id: int
    username: str
    rating: float
    comment: str

# Схема для создания (то, что присылает фронтенд)
class ReviewCreate(ReviewBase):
    pass

# Схема для ответа (то, что бэкенд возвращает фронтенду)
class Review(ReviewBase):
    id: int

    class Config:
        from_attributes = True # Позволяет Pydantic работать с моделями SQLAlchemy