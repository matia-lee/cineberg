import openai
import os
from dotenv import load_dotenv

load_dotenv(".env")

openai.api_key = os.environ.get("OPEN_AI_KEY")

def get_movie_analysis(movie_title):
    system_message = "You are a knowledgeable film critic with a deep passion for cinema. Your expertise includes a thorough understanding of film history, genres, directing styles, and the cultural impact of movies. Provide analyses in third person, focusing on depth, insight, and the exploration of themes, without needing an introduction. Dive directly into the analysis, offering perspectives that reflect a deep engagement with the film's context, its message, and its historical and cultural significance."
    
    user_message = f"Without the use of an introduction, without using too sophisticated words, and in third person, go straight into the prompt: through the lens of a niche, passionate, genuine film critic, provide me a detailed and insightful examination and analysis focusing on the analyzing the deeper message of and explaining the history/ influence/ story behind the making of the movie {movie_title}. Make it introspective and deep"
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
    )
    
    return response.choices[0].message['content'] 

# movie_title = "moonrise kingdom"
# print(get_movie_analysis(movie_title))

