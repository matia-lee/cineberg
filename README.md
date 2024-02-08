# CINEBERG 🎬

Includes everything from the tip of the iceberg throughout!

## Overview

Lets be real...
Everybody loves being able to put their friends onto new, undiscovered, and underground sh\*t. Cineberg allows you to find those underappreciated niche and underground movies so that you can share the joy and love of watching movies to the people you love! (while also being able to remind them of that time you put them on🤓)

### Cineberg Includes

- Over 800 000 movies to search and discover 🍿
- The Cineberg Scale - a unique metric to find movies that are either "Tip of the Iceberg", "Niche", or "Underground" 🧊
- Updated daily, including Trending Movies, Upcoming Movies, Now Playing Movies and over 19 different genres to browse from 🎞️
- A ML advanced movie recommendation system based around the Cineberg Scale 🤓

## Setup

### What you'll need...

- OpenAI API Key
- TMDB API Key

### Installation Steps

1.  Begin by cloning the repository:
     `git clone https://github.com/matia-lee/cineberg.git`
2.  Inside the "frontend" folder, create a `.env` file and include:

```dosini
REACT_APP_TMDB_KEY="< insert tmdb api key >"
```

3.  Inside the "backend" folder, create another `.env` file and include:

```dosini
tmdb_key="< insert tmdb api key >"
OPEN_AI_KEY="< insert openai api key >"
```

4.  To Start go to terminal:
    ```dosini
    cd backend
    python3 app.py
    ```
    ```dosini
    cd frontend
    npm start
    ```

