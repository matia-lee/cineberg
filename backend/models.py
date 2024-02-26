from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    interactions = relationship('UserMovieInteraction', backref='user', lazy=True)

class Movie(Base):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    tmdb_id = Column(Integer, unique=True, nullable=False)
    # interactions = relationship('UserMovieInteraction', backref='movie', lazy=True)

class UserMovieInteraction(Base):
    __tablename__ = 'user_movie_interaction'
    id = Column(Integer, primary_key=True)
    # user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    username = Column(String(80), ForeignKey('user.username'), nullable=False)
    # movie_id = Column(Integer, ForeignKey('movie.id'), nullable=False)
    movie_id = Column(Integer, nullable=False)
    interaction = Column(String(10), nullable=False)
    timestamp = Column(DateTime, default=func.current_timestamp())
    # __table_args__ = (UniqueConstraint('user_id', 'movie_id', 'interaction', name='unique_user_movie_interaction'),)
    __table_args__ = (UniqueConstraint('username', 'movie_id', 'interaction', name='unique_user_movie_interaction'),)