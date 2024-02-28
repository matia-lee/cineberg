from models import UserLikedMovies
from database import db_session
import requests
import os
from dotenv import load_dotenv
import openai
import time
import json 
from celeryconfig import celery_app

load_dotenv(".env")

application_token = os.environ.get("tmdb_key")

@celery_app.task
def get_liked_movies(username=None, movie_id=None):
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + application_token
    }

    if username and movie_id:
        user_liked_movies = db_session.query(UserLikedMovies).filter_by(username=username, movie_id=movie_id).all()
    else:
        user_liked_movies = db_session.query(UserLikedMovies).all()

    user_liked_movies = db_session.query(UserLikedMovies).all()

    for liked_movie in user_liked_movies:
        movie_id = liked_movie.movie_id
        try:
            movie_info_url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=en-US"
            movie_info_result = requests.get(movie_info_url, headers=headers)
            movie_info_response_data = movie_info_result.json()
            movie_genre_list = movie_info_response_data["genres"]
            movie_genre = []
            for genre in movie_genre_list:
                movie_genre.append(genre["name"])
            movie_overview = movie_info_response_data["overview"]
            movie_release_date = movie_info_response_data["release_date"]
            movie_runtime = movie_info_response_data["runtime"]
            movie_review = movie_info_response_data["vote_average"]
            movie_language = movie_info_response_data["original_language"]
            movie_popularity = movie_info_response_data["popularity"]
            movie_production_company_list = movie_info_response_data["production_companies"]
            movie_producion_company = []
            for production_company in movie_production_company_list:
                movie_producion_company.append(production_company["name"])
            
            credits_info_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language=en-US"
            credits_info_result = requests.get(credits_info_url, headers=headers)
            credits_info_response_data = credits_info_result.json()
            movie_credits_cast = credits_info_response_data["cast"]
            movie_cast = []
            for cast in movie_credits_cast:
                movie_cast.append(cast["name"])
            movie_credits_crew = credits_info_response_data["crew"]
            movie_crew = []
            for crew in movie_credits_crew:
                movie_crew.append(crew["name"])
            

            content_to_embed = f"{movie_genre} \n{movie_overview} \n {movie_release_date} \n {movie_runtime} \n {movie_review} \n {movie_language} \n {movie_popularity} \n {movie_producion_company} \n {movie_cast} \n {movie_crew}" 
            
            liked_movie.content_to_embed = content_to_embed
            
        except Exception as e:
            db_session.rollback()
            print(f"Error updating movie_id {movie_id}: {e}")

    def get_embeddings_batch(texts, engine):
        embeddings = []
        BATCH_SIZE = 2048
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i:i + BATCH_SIZE]
            while True:
                try:
                    response = openai.Embedding.create(input=batch, engine=engine)
                    batch_embeddings = [item["embedding"] for item in response["data"]]
                    embeddings.extend(batch_embeddings)
                    break 
                except openai.error.RateLimitError:
                    print("Rate limit reached, sleeping for 20 seconds...")
                    time.sleep(20)
                except openai.error.OpenAIError as e:
                    print(f"An error occurred: {e}")
                    time.sleep(20)
        return embeddings

    openai.api_key = os.environ.get("OPEN_AI_KEY")

    texts_to_embed = [movie.content_to_embed for movie in db_session.query(UserLikedMovies).all()]
    movies_df_embeddings = get_embeddings_batch(texts_to_embed, engine='text-embedding-ada-002')

    for index, movie in enumerate(db_session.query(UserLikedMovies).all()):
        movie.embedded_content = json.dumps(movies_df_embeddings[index])  
        db_session.add(movie)

    db_session.commit()