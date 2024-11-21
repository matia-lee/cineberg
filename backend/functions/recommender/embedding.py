from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np

movie_df = pd.read_csv("../data/without_sentiment/master_df.csv")

# model = SentenceTransformer("all-MiniLM-L6-v2")
model = SentenceTransformer("all-mpnet-base-v2")
embeddings = model.encode(movie_df["content_to_embed"], show_progress_bar=True)
embeddings_list = model.encode(movie_df["content_to_embed"].tolist())

np.save("../embeddings/master_embeddings_model.npy", embeddings)