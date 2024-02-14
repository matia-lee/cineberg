from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from dotenv import load_dotenv

service = Service(executable_path="./chromedriver")
driver = webdriver.Chrome(service=service)

load_dotenv(".env")

driver.get(os.environ.get("website_url"))

news_lists = driver.find_elements(By.CSS_SELECTOR, ".cards_cards-container__HiYvz")

article_titles = []
article_urls = []
articles_data = []

for item in news_lists:
    titles = item.find_elements(By.CSS_SELECTOR, ".card_title__I1a3A")

    for title in titles:
        article_titles.append(title.text)

    clickables = item.find_elements(By.CSS_SELECTOR, ".card_image-content__GDM2z")

    for clickable in clickables:
        links = clickable.find_elements(By.CSS_SELECTOR, "a")

        for link in links:
            url = link.get_attribute("href")
            article_urls.append(url)


for i, url in enumerate(article_urls):
    driver.get(url)
    paragraphs_elements = driver.find_elements(By.CLASS_NAME, "article_article-content__3auQJ")
    paragraphs_text = [p.text for p in paragraphs_elements]
    article_content = " ".join(paragraphs_text)
    articles_data.append({
        "title": article_titles[i],
        "url": url,
        "content": article_content
    })
    
driver.quit()

for article in articles_data:
    print(article["title"], article["content"])