from keybert import KeyBERT
import pandas as pd

kw_model = KeyBERT()

def extract_stylistic_keywords(overview):
    keywords = kw_model.extract_keywords(overview, stop_words="english")
    output = [keyword[0] for keyword in keywords]
    print(output)
    return(output)

movie_df = pd.read_csv("../data/movies201-214.csv")

# movie_df["stylistic_tags"] = movie_df["overview"].apply(extract_stylistic_keywords)
movie_df["release_decade"] = movie_df["release_date"].str[:3] + "0"
movie_df.to_csv("../data/movies201-214-updated.csv", index=False)