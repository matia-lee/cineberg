import faiss
import numpy as np

embeddings = np.load("../embeddings/master_embeddings_model.npy")

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)

index.add(embeddings)

faiss.write_index(index, "../embeddings/faiss_movie_index_model")