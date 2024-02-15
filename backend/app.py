from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import openai
import os
from openai.embeddings_utils import get_embedding
from openai.embeddings_utils import cosine_similarity
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from flask_apscheduler import APScheduler
from dotenv import load_dotenv
import logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv(".env")
openai.api_key = os.environ.get("OPEN_AI_KEY")

def recommend_movies(cineberg_scale, user_input):
    movies_df = pd.read_csv('masterdf.csv')
    movies_df['embedding'] = movies_df['embedding'].apply(eval).apply(np.array)

    logging.debug(f"Cineberg Scale: {cineberg_scale}")

    if cineberg_scale == "1":
        popularity_threshold = [31,100000]
    elif cineberg_scale == "2":
        popularity_threshold = [6.9,31]
    elif cineberg_scale == "3":
        popularity_threshold = [0,6.9]
    elif cineberg_scale == "4":
        popularity_threshold = [0, 1000000]

    user_input_vector = get_embedding(user_input, engine="text-embedding-ada-002")

    movies_df["similarities"] = movies_df['embedding'].apply(lambda x: cosine_similarity(x, user_input_vector))
    filtered_movies_df = movies_df[(movies_df['popularity'] >= popularity_threshold[0]) & (movies_df['popularity'] < popularity_threshold[1])]

    logging.debug(f"Filtered Movies Count: {filtered_movies_df.shape[0]}")  

    recommended_movies = filtered_movies_df.sort_values("similarities", ascending=False).head(10)

    recommended_movies_id = recommended_movies['id'].tolist()
    return recommended_movies_id


app = Flask(__name__)
CORS(app)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@app.route('/recommend_movies', methods=['POST'])
def process_input():
    data = request.get_json()
    cineberg_scale = data.get('cinebergScale')
    user_input = data.get('searchTerm')

    if user_input:
        recommended_movies_id = recommend_movies(cineberg_scale, user_input)
        return jsonify(recommended_movies_id)
    else:
        return jsonify({"error": "No search term provided"}), 400
    





news_cache = []

def scrape_news():
    options = Options()
    options.add_argument("--headless")
    service = Service(executable_path="./chromedriver")
    driver = webdriver.Chrome(service=service, options=options)

    articles_data = []

    try:
        load_dotenv(".env")
        driver.get(os.environ.get("website_url"))

        news_lists = driver.find_elements(By.CSS_SELECTOR, ".cards_cards-container__HiYvz")

        article_titles = []
        article_urls = []
        article_images = []
        
        

        for item in news_lists:
            titles = item.find_elements(By.CSS_SELECTOR, ".card_title__I1a3A")

            for title in titles:
                article_titles.append(title.text)

            clickables = item.find_elements(By.CSS_SELECTOR, ".card_image-content__GDM2z")

            for clickable in clickables:
                links = clickable.find_elements(By.CSS_SELECTOR, "a")
                pictures = clickable.find_elements(By.CSS_SELECTOR, "img")

                for link in links:
                    url = link.get_attribute("href")
                    article_urls.append(url)
                for picture in pictures:
                    image_url = picture.get_attribute("src")
                    article_images.append(image_url)


        for i, url in enumerate(article_urls):
            driver.get(url)
            paragraphs_elements = driver.find_elements(By.CLASS_NAME, "article_article-content__3auQJ")
            paragraphs_text = [p.text for p in paragraphs_elements]
            article_content = " ".join(paragraphs_text)
            articles_data.append({
                "title": article_titles[i],
                "url": url,
                "content": article_content,
                "image": article_images[i]
            })
    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

    global news_cache
    news_cache = articles_data

@app.route('/news')
def get_news():
    return jsonify(news_cache)

scheduler.add_job(id="scheduled scraping", func=scrape_news, trigger="interval", hours=24)

if __name__ == '__main__':
    scrape_news()
    app.run(debug=True)