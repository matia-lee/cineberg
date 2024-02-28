from models import UserLikedMovies
from database import db_session
import os
import openai
import time
from dotenv import load_dotenv
import json 

load_dotenv(".env")

def embed_liked_movies ():
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