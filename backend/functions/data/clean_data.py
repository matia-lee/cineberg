import pandas as pd
import unicodedata
import re

df1 = pd.read_csv("./with_sentiment/movies1-50-sentiment.csv")
df2 = pd.read_csv("./with_sentiment/movies51-100-sentiment.csv")
df3 = pd.read_csv("./with_sentiment/movies101-150-sentiment.csv")
df4 = pd.read_csv("./with_sentiment/movies151-200-sentiment.csv")
df5 = pd.read_csv("./with_sentiment/movies201-214-sentiment.csv")

combined_df = pd.concat([df1, df2, df3, df4, df5])
# combined_df.to_csv("./with_sentiment/master_df_sentiment.csv")

def clean_data(data):
    data = unicodedata.normalize('NFKD', data)
    data = re.sub(r'[^\x00-\x7F]+', '', data)
    data = data.lower()
    data = re.sub(r'\s+', ' ', data).strip()
    return data

movie_df = pd.read_csv("./with_sentiment/master_df_sentiment.csv")
movie_df["content_to_embed"] = movie_df["content_to_embed"].apply(clean_data)
movie_df.to_csv("./with_sentiment/cleaned_master_df.csv")