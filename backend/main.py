import pandas as pd
import numpy as np
import os
import openai
from openai.embeddings_utils import get_embedding, cosine_similarity
import logging

logging.basicConfig(level=logging.DEBUG)
openai.api_key = os.getenv("OPEN_AI_KEY")

def recommend_movies(cineberg_scale, user_input):
    movies_df = pd.read_csv('masterdf.csv')
    movies_df['embedding'] = movies_df['embedding'].apply(eval).apply(np.array)

    logging.debug(f"Cineberg Scale: {cineberg_scale}")

    popularity_threshold = {
        "1": [31, 100000],
        "2": [6.9, 31],
        "3": [0, 6.9],
        "4": [0, 1000000]
    }.get(cineberg_scale, [0, 1000000])

    user_input_vector = get_embedding(user_input, engine="text-embedding-ada-002")
    movies_df["similarities"] = movies_df['embedding'].apply(lambda x: cosine_similarity(x, user_input_vector))
    filtered_movies_df = movies_df[(movies_df['popularity'] >= popularity_threshold[0]) & (movies_df['popularity'] < popularity_threshold[1])]
    logging.debug(f"Filtered Movies Count: {filtered_movies_df.shape[0]}")

    recommended_movies = filtered_movies_df.sort_values("similarities", ascending=False).head(10)
    recommended_movies_id = recommended_movies['id'].tolist()
    return recommended_movies_id
