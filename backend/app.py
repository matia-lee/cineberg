from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from database import init_db, db_session
from main import recommend_movies
from gather_liked_movies import get_liked_movies
from embed_liked_movies import aggregate_liked_embeddings
from movie_analysis import get_movie_analysis
from models import User, Base, UserMovieInteraction, UserLikedMovies
from enum import Enum, unique
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
from celeryconfig import celery_app 
from datetime import datetime, timedelta
import os

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
    username = data.get("username")
    movie_id = data.get("movie_id")
    interaction_type = data.get("interaction")

    if interaction_type not in InteractionType._value2member_map_:
        return jsonify({"error": "Invalid interaction type"}), 400

    existing_interaction = db_session.query(UserMovieInteraction).filter_by(username=username, movie_id=movie_id).first()

    def add_to_liked_movies(username, movie_id):
        exists = db_session.query(UserLikedMovies.id).filter_by(username=username, movie_id=movie_id).first() is not None
        if not exists:
            try:
                new_liked_movie = UserLikedMovies(username=username, movie_id=movie_id)
                db_session.add(new_liked_movie)
                db_session.commit()
                get_liked_movies.apply_async(args=[username, movie_id], countdown=10)
            except IntegrityError:
                db_session.rollback()

    def apply_interaction_rules(existing_interaction, interaction_type):
        try:
            current_interactions = existing_interaction.interaction.split("+") if existing_interaction else []

            if interaction_type in current_interactions:
                current_interactions.remove(interaction_type)
                liked_movie = db_session.query(UserLikedMovies).filter_by(username=username, movie_id=movie_id).first()
                if liked_movie:
                    db_session.delete(liked_movie)
            else:
                if interaction_type in [InteractionType.THUMBS_UP.value, InteractionType.THUMBS_DOWN.value]:
                    opposite_interaction = InteractionType.THUMBS_DOWN.value if interaction_type == InteractionType.THUMBS_UP.value else InteractionType.THUMBS_UP.value
                    if opposite_interaction in current_interactions:
                        return jsonify({"error": "Cannot combine thumbs up and thumbs down"}), 400
                current_interactions.append(interaction_type)
                if interaction_type == InteractionType.THUMBS_UP.value:
                    add_to_liked_movies(username, movie_id)
                if len(current_interactions) > 2 or (InteractionType.THUMBS_UP.value in current_interactions and InteractionType.THUMBS_DOWN.value in current_interactions):
                    return jsonify({"error": "Invalid combination of interactions"}), 400

            if current_interactions:
                existing_interaction.interaction = "+".join(current_interactions)
            else:
                db_session.delete(existing_interaction)

            db_session.commit()
            return jsonify({"message": "Interaction updated successfully"}), 200
        except Exception as e:
            db_session.rollback()
            return jsonify({"error": "Could not process interaction"}), 500

    if existing_interaction:
        return apply_interaction_rules(existing_interaction, interaction_type)
    else:
        try:
            new_interaction = UserMovieInteraction(username=username, movie_id=movie_id, interaction=interaction_type)
            db_session.add(new_interaction)
            db_session.commit()
            if interaction_type == InteractionType.THUMBS_UP.value:
                add_to_liked_movies(username, movie_id)
            db_session.commit()
            return jsonify({"message": "New interaction added successfully"}), 201
        except Exception as e:
            db_session.rollback()
            return jsonify({"error": "Could not add interaction"}), 500

@app.route("/get_interactions_state", methods = ['GET'])
def get_interactions_state():
    username = request.args.get("username")
    movie_id = request.args.get("movie_id")

    if not username or not movie_id:
        return jsonify({"error": "could not retrieve username and movie_id"}), 400
    
    interaction = db_session.query(UserMovieInteraction).filter_by(username=username, movie_id=movie_id).first()

    if interaction:
        return jsonify({"interaction": interaction.interaction}), 200
    else:
        return jsonify({"interaction": None}), 200

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
    
@app.route('/get_watched_movie_ids', methods=['GET'])
def get_watched_movie_ids():
    username = request.args.get('username')
    results = db_session.query(UserMovieInteraction.movie_id).filter(UserMovieInteraction.interaction.like('%watched%'), UserMovieInteraction.username == username).distinct().all()
    watched_movie_ids = [result.movie_id for result in results]
    return jsonify(watched_movie_ids)

@app.route('/get_liked_movie_ids', methods=['GET'])
def get_liked_movie_ids():
    username = request.args.get('username')
    results = db_session.query(UserMovieInteraction.movie_id).filter(UserMovieInteraction.interaction.like('%thumbs_up%'), UserMovieInteraction.username == username).distinct().all()
    liked_movie_ids = [result.movie_id for result in results]
    return jsonify(liked_movie_ids)

@app.route('/get_disliked_movie_ids', methods=['GET'])
def get_disliked_movie_ids():
    username = request.args.get('username')
    results = db_session.query(UserMovieInteraction.movie_id).filter(UserMovieInteraction.interaction.like('%thumbs_down%'), UserMovieInteraction.username == username).distinct().all()
    disliked_movie_ids = [result.movie_id for result in results]
    return jsonify(disliked_movie_ids)

cache = {}

def is_cache_valid(entry_time):
    return datetime.now() - entry_time < timedelta(hours=24)

@app.route('/recommended_liked_movies', methods=['GET'])
def recommended_liked_movies():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "username not found"}), 400
    
    if username in cache and is_cache_valid(cache[username]['time']):
        return jsonify(cache[username]['data'])
    
    try:
        recommend_movie_ids = aggregate_liked_embeddings(username)
        cache[username] = {'time': datetime.now(), 'data': recommend_movie_ids}
        return jsonify(recommend_movie_ids)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



# for movie analysis
@app.route('/movie_analysis', methods=['POST'])
def movie_analysis():
    data = request.get_json()
    movie_title = data.get('searchTerm')

    if movie_title:
        analysis = get_movie_analysis(movie_title)
        return jsonify(analysis)
    else:
        return jsonify({"error": "No search term provided"}), 400


if __name__ == '__main__':
    scrape_news()
    init_db()
    # app.run(debug=True)
    app.run(debug=False)