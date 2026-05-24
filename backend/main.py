import os
from typing import List

import database
import httpx

import models
import schemas
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

app = FastAPI(title="MovieRate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

# TMDB_API_KEY = os.getenv("TMDB_API_KEY", "bad7873e5fd0a11f0bfd9c0e6a888c33")
TMDB_API_KEY = "bad7873e5fd0a11f0bfd9c0e6a888c33"
TMDB_BASE_URL = "https://api.themoviedb.org/3"

async def fetch_from_tmdb(endpoint: str, params: dict | None = None):
    if params is None:
        params = {}
    params["api_key"] = TMDB_API_KEY
    params["language"] = "ru-RU"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{TMDB_BASE_URL}/{endpoint}", params=params, timeout=10.0
            )
            print(f"TMDB Response: {response.status_code}") 
            if response.status_code != 200:
                print(f"Error details: {response.text}")
                raise HTTPException(
                    status_code=response.status_code, detail="Ошибка внешнего API"
                )
            return response.json()
        except httpx.RequestError as exc:
            print(f"REAL ERROR: {exc}")
            raise HTTPException(
                status_code=503, detail=str(exc))

    # async with httpx.AsyncClient() as client:
    #     try:
    #         response = await client.get(f"{TMDB_BASE_URL}/{endpoint}", params=params, timeout=10.0)
    #         if response.status_code != 200:
    #             raise HTTPException(status_code=response.status_code, detail="Ошибка внешнего API фильмов")
    #         return response.json()
    #     except httpx.RequestError:
    #         raise HTTPException(status_code=503, detail="Сервис TMDB недоступен")


@app.get("/movies/popular")
async def get_popular_movies(page: int = 1):
    """получает список популярных фильмов через бэкенд"""
    return await fetch_from_tmdb("movie/popular", {"page": page})


@app.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    """получает детальную информацию о фильме"""
    return await fetch_from_tmdb(f"movie/{movie_id}")


@app.get("/movies/search")
async def search_movies(query: str):
    """поиск фильмов по названию"""
    return await fetch_from_tmdb("search/movie", {"query": query})


@app.post("/reviews/", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(database.get_db)):
    """сохраняет отзыв пользователя в нашей базе данных"""
    db_review = models.Review(
        movie_id=review.movie_id,
        username=review.username,
        rating=review.rating,
        comment=review.comment,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@app.get("/reviews/{movie_id}", response_model=List[schemas.Review])
def get_movie_reviews(movie_id: int, db: Session = Depends(database.get_db)):
    """получает все отзывы для конкретного фильма из нашей базы"""
    reviews = db.query(models.Review).filter(models.Review.movie_id == movie_id).all()
    return reviews


@app.get("/")
def health_check():
    return {"status": "ok", "message": "MovieRate API is running"}
