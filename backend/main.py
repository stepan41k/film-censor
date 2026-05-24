from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Правильные импорты
import models
import schemas
import database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Для разработки можно оставить так
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем таблицы при запуске
models.Base.metadata.create_all(bind=database.engine)

@app.post("/reviews/", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(database.get_db)):
    db_review = models.Review(
        movie_id=review.movie_id,
        username=review.username,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/reviews/{movie_id}", response_model=list[schemas.Review])
def get_reviews(movie_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Review).filter(models.Review.movie_id == movie_id).all()