from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import openai
import os
from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity
from dotenv import load_dotenv

load_dotenv(".env")
openai.api_key = os.environ.get("OPEN_AI_KEY")

def recommend_movies(user_input):
    movies_df = pd.read_csv('masterdf-updated.csv')
    movies_df['embedding'] = movies_df['embedding'].apply(eval).apply(np.array)

    popularity_threshold = [17, 1000000]

    # user_input = input('What type of movie would you like to see? ')
    user_input_vector = get_embedding(user_input, engine="text-embedding-ada-002")

    movies_df["similarities"] = movies_df['embedding'].apply(lambda x: cosine_similarity(x, user_input_vector))
    filtered_movies_df = movies_df[(movies_df['popularity'] >= popularity_threshold[0]) & (movies_df['popularity'] <= popularity_threshold[1])]
    recommended_movies = filtered_movies_df.sort_values("similarities", ascending=False).head(10)

    recommended_movies_id = recommended_movies['id'].tolist()
    return recommended_movies_id


app = Flask(__name__)
CORS(app)


@app.route('/recommend_movies', methods=['POST'])
def process_input():
    data = request.get_json()
    user_input = data.get('searchTerm')

    if user_input:
        recommended_movies_id = recommend_movies(user_input)
        return jsonify(recommended_movies_id)
    else:
        return jsonify({"error": "No search term provided"}), 400


if __name__ == '__main__':
    app.run(debug=True)