from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Model, relationship, DateTime, func, UniqueConstraint

db = SQLAlchemy()

class User(Model):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    interactions = relationship('UserMovieInteraction', backref='user', lazy=True)

class Movie(Model):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    tmdb_id = Column(Integer, unique=True, nullable=False)
    interactions = relationship('UserMovieInteraction', backref='movie', lazy=True)

class UserMovieInteraction(Model):
    __tablename__ = 'user_movie_interaction'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    movie_id = Column(Integer, ForeignKey('movie.id'), nullable=False)
    interaction = Column(String(10), nullable=False)  # liked, disliked, watched
    timestamp = Column(DateTime, default=func.current_timestamp())
    __table_args__ = (UniqueConstraint('user_id', 'movie_id', 'interaction', name='unique_user_movie_interaction'),)
