from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from dotenv import load_dotenv

news_cache = []

def scrape_news():
    service = Service(executable_path="./chromedriver")
    driver = webdriver.Chrome(service=service)

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
            paragraphs_elements = driver.find_elements(By.CLASS_NAME, "content_content__i0P3p")
            credit_elements = driver.find_element(By.CLASS_NAME, "authorDate_author__a0WHZ")
            for author in credit_elements:
                author_credits = author.find_element(By.CLASS_NAME, "authorDate_author__name__1Xkpl")
            paragraphs_text = [p.text for p in paragraphs_elements]
            article_content = "\n".join(paragraphs_text)
            articles_data.append({
                "title": article_titles[i],
                "url": url,
                "content": article_content,
                "images": article_images[i],
                "author": author_credits
            })
    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

    global news_cache
    news_cache = articles_data
    print(news_cache)

scrape_news()