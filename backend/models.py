from sqlalchemy import Column, Integer, String, Text, Float
from database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, index=True)
    username = Column(String)
    rating = Column(Float)
    comment = Column(Text)