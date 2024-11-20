import requests
import pandas as pd
import os
from dotenv import load_dotenv


load_dotenv()
tmdb_key = os.getenv("tmdb_key")

headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {tmdb_key}"
}

# total_pages = 214
def grab_movie_data(total_pages):
    headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {tmdb_key}"
    }
    movie_data = []

    for page in range(1, total_pages + 1):
        movie_pages_url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=1000"
        response = requests.get(movie_pages_url, headers=headers)

        results = response.json()["results"]
        # print("results: ", results)
        for movie in results:
            movie_id = movie["id"]

            details = requests.get(f"https://api.themoviedb.org/3/movie/{str(movie_id)}?language=en-US", headers=headers).json()
            credits = requests.get(f"https://api.themoviedb.org/3/movie/{str(movie_id)}/credits?language=en-US", headers=headers).json()
            keywords = requests.get(f"https://api.themoviedb.org/3/movie/{str(movie_id)}/keywords", headers=headers).json()

            movie_data.append({
                "id": details["id"],
                "title": details["title"],
                "overview": details["overview"],
                "genres": [genre["name"] for genre in details["genres"]],
                "release_date": details["release_date"],
                "popularity": details["popularity"],
                "vote_average": details["vote_average"],
                "runtime": details["runtime"],
                "cast": [cast["name"] for cast in credits["cast"][:7]],
                "director": [crew["name"] for crew in credits["crew"] if crew["job"] == "Director"],
                "keywords": [keyword["name"] for keyword in keywords["keywords"]]
            })

        # print("movie data: ", movie_data)

    return pd.DataFrame(movie_data)

movie_detail_df = grab_movie_data(total_pages=1)
# movie_detail_df.to_csv("movies201-214.csv", index=False)