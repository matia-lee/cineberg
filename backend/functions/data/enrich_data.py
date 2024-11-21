from keybert import KeyBERT
import pandas as pd
from transformers import pipeline

kw_model = KeyBERT()

def extract_stylistic_keywords(overview):
    keywords = kw_model.extract_keywords(overview, stop_words="english")
    output = [keyword[0] for keyword in keywords]
    print(output)
    return(output)

movie_df = pd.read_csv("./movies201-214.csv")
# movie_df_sentiment = pd.read_csv("./movies201-214-sentiment.csv")

# movie_df["stylistic_tags"] = movie_df["overview"].apply(extract_stylistic_keywords)
# movie_df["release_decade"] = movie_df["release_date"].str[:3] + "0"

# sentiment_pipeline = pipeline("sentiment-analysis")
# movie_df["sentiment"] = movie_df["overview"].apply(
#     lambda text: sentiment_pipeline(text)[0]["label"]
# )

# data = ["I love you", "I hate you"]
# result = sentiment_pipeline(data)
# print(result["label"])

movie_df["content_to_embed"] = movie_df.apply(
    lambda row: (
        f"Title: {row['title']}. "
        f"Genres: {', '.join([row['genres']])}. Keywords: {', '.join([row['keywords']])}. "
        f"Overview: {row['overview']}. Stylistic Tags: {', '.join([row['stylistic_tags']])}. "
        f"Release Decade: {row['release_decade']}."
    ),
    axis=1
)

movie_df.to_csv("./movies201-214-updated.csv", index=False)