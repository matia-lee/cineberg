from models import UserLikedMovies, UserMovieInteraction
from database import db_session
import pandas as pd
import numpy as np
from openai.embeddings_utils import get_embedding, cosine_similarity
from dotenv import load_dotenv
import json 

load_dotenv(".env")

def aggregate_liked_embeddings (username):

    user_liked_movies = db_session.query(UserLikedMovies).filter_by(username=username).all()
    
    embeddings = []
    for movie in user_liked_movies:
        if movie.embedded_content:
            embedding = json.loads(movie.embedded_content)
            embeddings.append(embedding)

    watched_movie_ids = db_session.query(UserMovieInteraction.movie_id).filter(UserMovieInteraction.interaction.like('%watched%')).all()
    watched_movie_ids = [m[0] for m in watched_movie_ids]

    movies_df = pd.read_csv('masterdf.csv')
    movies_df['embedding'] = movies_df['embedding'].apply(eval).apply(np.array)
    
    aggregated_embedding = [sum(x) / len(embeddings) for x in zip(*embeddings)]
    movies_df["similarities"] = movies_df['embedding'].apply(lambda x: cosine_similarity(x, aggregated_embedding))
    filtered_movies_df = movies_df[(movies_df['popularity'] >= 6.9) & (~movies_df['id'].isin(watched_movie_ids))]
    recommended_movies = filtered_movies_df.sort_values("similarities", ascending=False).head(20)
    recommended_movies_id = recommended_movies['id'].tolist()

    return recommended_movies_id