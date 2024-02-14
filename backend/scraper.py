from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.keys import Keys
import os
from dotenv import load_dotenv

service = Service(executable_path="./chromedriver")
driver = webdriver.Chrome(service=service)

load_dotenv(".env")

driver.get(os.environ.get("website_url"))

# WebDriverWait(driver, 5).until(
#     EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".cards_under-hero__V5y6G, .cards_cards-container__HiYvz"))
# )

news_lists_1 = driver.find_elements(By.CSS_SELECTOR, ".cards_under-hero__V5y6G")
news_lists_2 = driver.find_elements(By.CSS_SELECTOR, ".cards_cards-container__HiYvz")

article_titles = []
article_urls = []

for item in news_lists_1 + news_lists_2:
    titles = item.find_elements(By.CSS_SELECTOR, ".card_title__I1a3A")

    for title in titles:
        article_titles.append(title.text)

    links = item.find_elements(By.CSS_SELECTOR, "a")
    
    for link in links:
        url = link.get_attribute("href")
        article_urls.append(url)

# for url in article_urls:
#     driver.get(url)
#     WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[@class='article-content']")))


print(article_titles, article_urls)
    



driver.quit()