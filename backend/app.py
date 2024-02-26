from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from database import init_db, db_session
from main import recommend_movies
from models import User, Base, Movie, UserMovieInteraction
from enum import Enum, unique
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
import os
import logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv(".env")

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})
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
@unique
class InteractionType(Enum):
    THUMBS_UP = "thumbs_up"
    THUMBS_DOWN = "thumbs_down"
    WATCHED = "watched"

@app.route('/signup', methods=['POST'])
def signup(): 
    data = request.get_json()
    try:
        new_user = User(username=data['username'], email=data['email'])
        db_session.add(new_user)
        db_session.commit()
        return jsonify({"message": "User added successfully."}), 201
    except IntegrityError as e:
        db_session.rollback()
        if 'email' in str(e.orig):
            return jsonify({"message": "Email already in use"}), 409
        elif 'username' in str(e.orig):
            return jsonify({"message": "Username taken"}), 409
        else:
            return jsonify({"message": "Error occured"}), 409

@app.route('/get_interactions', methods=['POST'])
def get_interactions():
    data = request.get_json()
    logging.debug(f"Received interaction data: {data}")
    username = data.get("username")
    movie_id = data.get("movie_id")
    interaction_type = data.get("interaction")

    if interaction_type not in InteractionType._value2member_map_:
        logging.warning(f"Invalid interaction type received: {interaction_type}")
        return jsonify({"error": "Invalid interaction type"}), 400

    existing_interaction = db_session.query(UserMovieInteraction).filter_by(username=username, movie_id=movie_id).first()

    if existing_interaction:
        if existing_interaction.interaction == interaction_type:
            try:
                db_session.delete(existing_interaction)
                db_session.commit()
                return jsonify({"message": "Interaction toggled successfully"}), 200
            except Exception as e:
                db_session.rollback()
                return jsonify({"error": "Could not toggle interaction"}), 500
        elif existing_interaction.interaction != interaction_type:
            try:
                if interaction_type == InteractionType.WATCHED.value:
                    if InteractionType.WATCHED.value in existing_interaction.interaction:
                        existing_interaction.interaction = existing_interaction.interaction.replace(f"+{InteractionType.WATCHED.value}", "")
                    else:
                        existing_interaction.interaction += f"+{InteractionType.WATCHED.value}"
                else:
                    if interaction_type in existing_interaction.interaction:
                        existing_interaction.interaction = existing_interaction.interaction.replace(f"+{interaction_type}", "")
                    else:
                        existing_interaction.interaction += f"+{interaction_type}"
                
                db_session.commit()
                return jsonify({"message": "Interaction updated successfully"}), 200
            except Exception as e:
                db_session.rollback()
                return jsonify({"error": "Could not update interaction"}), 500
    else:
        try:
            new_interaction = UserMovieInteraction(username=username, movie_id=movie_id, interaction=interaction_type)
            db_session.add(new_interaction)
            db_session.commit()
            return jsonify({"message": "New interaction added successfully"}), 201
        except Exception as e:
            db_session.rollback()
            return jsonify({"error": "Could not add interaction"}), 500

    return jsonify({"message": "Your request was received, but no specific action was taken. Please check your inputs and try again."}), 400


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/getUsername', methods=['GET'])
def getUsername():
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Could not find email in database"}), 400
    
    user = db_session.query(User).filter_by(email=email).first()
    if user:
        return jsonify({"message": user.username}), 200
    else:
        return jsonify({"message": "User not found"}), 404





if __name__ == '__main__':
    scrape_news()
    init_db()
    # app.run(debug=True)
    app.run(debug=False)