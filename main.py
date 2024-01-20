import pandas as pd
import numpy as np
import openai
import os
from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity
from dotenv import load_dotenv

load_dotenv(".env")

openai.api_key = os.environ.get("OPEN_AI_KEY")

movies_df = pd.read_csv("./master_data/masterdf-updated-notitle.csv")
movies_df['embedding'] = movies_df['embedding'].apply(eval).apply(np.array)



cineberg_scale = input("Pick: \n1. Tip of the IceBerg shit \n2. Niche Shit \n3. Underground Shit \n Pick 1, 2, or 3: ")
if cineberg_scale == "1":
    popularity_threshold = [17,100000]
elif cineberg_scale == "2":
    popularity_threshold = [9,17]
elif cineberg_scale == "3":
    popularity_threshold = [0,9]



user_input = input('What type of movie would you like to see? ')
user_input_vector = get_embedding(user_input, engine="text-embedding-ada-002")



movies_df["similarities"] = movies_df['embedding'].apply(lambda x: cosine_similarity(x, user_input_vector))
filtered_movies_df = movies_df[(movies_df['popularity'] >= popularity_threshold[0]) & (movies_df['popularity'] <= popularity_threshold[1])]
recommended_movies = filtered_movies_df.sort_values("similarities", ascending=False).head(10)
top_10_movies = recommended_movies['title']

print("Movies recommended for you: ")
for index, row in recommended_movies.iterrows():
    print(f"{row['title']} - Popularity Score: {row['popularity']}")


