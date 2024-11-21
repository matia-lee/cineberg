import openai
import pandas as pd
import time
import os
from dotenv import load_dotenv

load_dotenv()
openai_key= os.getenv("openai_key")
openai.api_key = openai_key

def get_embeddings_batch(texts, engine):
    embeddings = []
    BATCH_SIZE = 2048
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        while True:
            try:
                response = openai.Embedding.create(input=batch, engine=engine)
                batch_embeddings = [item["embedding"] for item in response["data"]]
                embeddings.extend(batch_embeddings)
                break 
            except openai.error.RateLimitError:
                print("Rate limit reached, sleeping for 20 seconds...")
                time.sleep(20)
            except openai.error.OpenAIError as e:
                print(f"An error occurred: {e}")
                time.sleep(20)
    return embeddings

movies_df = pd.read_csv("../data/with_sentiment/master_df_sentiment.csv")
texts_to_embed = movies_df["content_to_embed"].tolist()
movies_df["embeddings"] = get_embeddings_batch(texts_to_embed, engine="text-embedding-ada-002")

movies_df.to_csv("../embeddings/openai/master_embeddings_sentiment.csv", index=False)