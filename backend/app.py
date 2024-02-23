from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from database import init_db, db_session
from main import recommend_movies
from models import User, Base
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
import os

load_dotenv(".env")

app = Flask(__name__)
CORS(app)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


# for recommending
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


# for scraping:
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
            credit_element = driver.find_element(By.CLASS_NAME, "authorDate_author__a0WHZ")
            author_credits = credit_element.find_element(By.CLASS_NAME, "authorDate_author__name__1Xkpl").text
            time_element = credit_element.find_element(By.TAG_NAME, "time")
            date_credit = time_element.get_attribute("datetime")
            paragraphs_text = [p.text for p in paragraphs_elements]
            article_content = " ".join(paragraphs_text)
            articles_data.append({
                "title": article_titles[i],
                "url": url,
                "content": article_content,
                "image": article_images[i],
                "author": author_credits,
                "date": date_credit
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




# for database:
@app.route('/signup', methods=['POST'])
def signup(): 
    data = request.get_json()
    try:
        new_user = User(email=data['email'])
        db_session.add(new_user)
        db_session.commit()
        return jsonify({"message": "User added successfully."}), 201
    except IntegrityError:
        db_session.rollback()
        return jsonify({"message": "This email is already used."}), 409
    
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    scrape_news()
    init_db()
    app.run(debug=True)