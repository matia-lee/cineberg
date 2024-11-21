from sentence_transformers import SentenceTransformer
import faiss
import pandas as pd

def recommend_movie(user_input):
    # model = SentenceTransformer("all-MiniLM-L6-v2")
    model = SentenceTransformer("all-mpnet-base-v2")
    index = faiss.read_index("../embeddings/faiss_movie_index_model")
    movie_df_titles = pd.read_csv("../data/without_sentiment/master_df.csv")["title"]

    input_embedding = model.encode([user_input])
    distances, indices = index.search(input_embedding, k=10)

    recommendations = movie_df_titles.iloc[indices[0]]

    print(recommendations)

recommend_movie("romantic comedies about high school")