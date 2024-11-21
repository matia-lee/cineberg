# from sentence_transformers import SentenceTransformer
# import faiss
# import pandas as pd

# def recommend_movie(user_input):
#     # model = SentenceTransformer("all-MiniLM-L6-v2")
#     model = SentenceTransformer("all-mpnet-base-v2")
#     index = faiss.read_index("../embeddings/faiss_movie_index_model")
#     movie_df_titles = pd.read_csv("../data/without_sentiment/master_df.csv")["title"]

#     input_embedding = model.encode([user_input])
#     distances, indices = index.search(input_embedding, k=10)

#     recommendations = movie_df_titles.iloc[indices[0]]

#     print(recommendations)

# recommend_movie("romantic comedies about high school")

import pandas as pd
import numpy as np
import os
import openai
from dotenv import load_dotenv
from openai.embeddings_utils import get_embedding, cosine_similarity

load_dotenv()
openai_key= os.getenv("openai_key")
openai.api_key = openai_key

def recommender(user_input):
    movies_df = pd.read_csv("../embeddings/openai/master_embeddings_sentiment.csv")
    movies_df["embeddings"] = movies_df["embeddings"].apply(eval).apply(np.array)

    user_input_vector = get_embedding(user_input, engine="text-embedding-ada-002")
    movies_df["similarities"] = movies_df["embeddings"].apply(lambda x: cosine_similarity(x, user_input_vector))

    res = movies_df.sort_values(by="similarities", ascending=False).head(10)["title"].tolist()

    print(res)
    return res

recommender("i want to cry my eyes out while watching my glorious king ryan gosling")