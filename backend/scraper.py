from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import os
from dotenv import load_dotenv

service = Service(executable_path="./chromedriver")
driver = webdriver.Chrome(service=service)

load_dotenv(".env")
driver.get(os.environ.get("website_url"))

news_lists = driver.find_elements(By.CSS_SELECTOR, ".o-tease-list__item")

for list in news_lists:
    free_content = list.find_elements(By.CSS_SELECTOR, "a.c-span__link.u-color-pale-sky-2")
    
    if free_content:
        title = list.find_element(By.CSS_SELECTOR, "h3")
        print(title.text)

driver.quit()