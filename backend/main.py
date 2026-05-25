import os
from contextlib import asynccontextmanager
from typing import List

import auth
import database
import httpx
import models
import schemas
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session, joinedload

http_client = httpx.AsyncClient(timeout=10.0, follow_redirects=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await http_client.aclose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

KP_API_KEY = os.getenv("KP_API_KEY", "17SF45M-ANE49MZ-PPZNCQQ-ARJF5RY")
KP_BASE_URL = "https://api.kinopoisk.dev/v1.4"

headers = {"X-API-KEY": KP_API_KEY}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = (
        db.query(models.User).filter(models.User.username == user.username).first()
    )
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "Успешная регистрация"}


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = (
        db.query(models.User).filter(models.User.username == form_data.username).first()
    )
    if not user or not auth.verify_password(
        form_data.password, str(user.hashed_password)
    ):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


async def fetch_from_kp(endpoint: str, params: dict | None = None):
    try:
        response = await http_client.get(
            f"{KP_BASE_URL}/{endpoint}", params=params, headers=headers
        )
        if response.status_code != 200:
            print(f"KP Error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code, detail="Ошибка API Кинопоиска"
            )
        return response.json()
    except httpx.RequestError as exc:
        print(f"Network error: {exc}")
        raise HTTPException(status_code=503, detail="Сервис Кинопоиска недоступен")


@app.get("/movies/popular")
async def get_popular():
    params = {
        "page": 1,
        "limit": 20,
        "selectFields": ["id", "name", "rating", "poster", "year"],
        "notNullFields": ["id", "name", "rating.kp", "poster.url"],
        "sortField": "rating.kp",
        "sortType": "-1",
    }
    return await fetch_from_kp("movie", params)


@app.get("/movies/search")
async def search_movies(query: str = Query(...)):
    params = {
        "query": query,
        "limit": 20,
        "selectFields": ["id", "name", "rating", "poster", "year"],
        "notNullFields": ["id", "name", "rating.kp", "poster.url"],
    }

    return await fetch_from_kp("movie/search", params)


def get_current_user(
    db: Session = Depends(database.get_db), token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Не удалось валидировать учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


@app.post("/reviews/", response_model=schemas.Review)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_review = models.Review(
        movie_id=review.movie_id,
        rating=review.rating,
        comment=review.comment,
        user_id=current_user.id,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@app.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    return await fetch_from_kp(f"movie/{movie_id}")


@app.get("/reviews/{movie_id}", response_model=List[schemas.Review])
def get_movie_reviews(movie_id: int, db: Session = Depends(database.get_db)):
    return (
        db.query(models.Review)
        .options(joinedload(models.Review.author))
        .filter(models.Review.movie_id == movie_id)
        .all()
    )


@app.get("/")
def health_check():
    return {"status": "ok", "message": "MovieRate API is running"}
