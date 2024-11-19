import requests
import pandas as pd
import os
from dotenv import load_dotenv


load_dotenv(".env")
application_token = os.environ.get("tmdb_key")


headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {application_token}"
}

df = pd.DataFrame(columns=["id", "title", "genres", "overview", "release_date", "runtime", "review", "language", "popularity", "cast", "crew", "content to embed"])

total_page = 214
for page in range(1, total_page + 1):
    # movie_pages_url = f'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=1000&with_genres=28%20%7C%2012%20%7C%2016%20%7C%2035%20%7C%2080%20%7C%2099%20%7C%2018%20%7C%2010751%20%7C%2014%20%7C%2036%20%7C%2027%20%7C%2010402%20%7C%209648%20%7C%2010749%20%7C%20878%20%7C%2053%20%7C%2010752%20%7C%2037%20%7C%2010770'
    movie_pages_url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=1000"
    response = requests.get(movie_pages_url, headers=headers)
    results = response.json()["results"]
    for result in results: 
        try:
            movie_id = result["id"]
            movie_info_result = requests.get(f"https://api.themoviedb.org/3/movie/{str(movie_id)}?language=en-US", headers=headers)
            movie_info_response_data = movie_info_result.json()
            movie_name = movie_info_response_data["title"]
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


            credits_info_result = requests.get(f"https://api.themoviedb.org/3/movie/{str(movie_id)}/credits?language=en-US", headers=headers)
            credits_info_response_data = credits_info_result.json()
            movie_credits_cast = credits_info_response_data["cast"]
            movie_cast = []
            for cast in movie_credits_cast:
                movie_cast.append(cast["name"])
            movie_credits_crew = credits_info_response_data["crew"]
            movie_crew = []
            for crew in movie_credits_crew:
                movie_crew.append(crew["name"])


            content_to_embed = f"Movie Genre: {movie_genre} \n Movie Overview: {movie_overview} \n Movie Release Date: {movie_release_date} \n Movie Runtime: {movie_runtime} \n Movie Review: {movie_review} \n Movie Language: {movie_language} \n Movie Popularity: {movie_popularity} \n Production Company: {movie_producion_company} \n Cast: {movie_cast} \n Crew: {movie_crew}"

            df.loc[len(df.index)] = [movie_id, movie_name, movie_genre, movie_overview, movie_release_date, movie_runtime ,movie_review, movie_language, movie_popularity, movie_cast, movie_crew, content_to_embed]
        except:
            print("loading...")

df.to_csv("MovieInfo.csv")