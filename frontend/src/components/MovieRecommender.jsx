import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieCardFlipped from "./MovieCardFlipped";

const MovieRecommender = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cinebergScale, setCinebergScale] = useState("");
  const [selectedScaleLabel, setSelectedScaleLabel] = useState("Select Scale");
  const [movieIds, setMovieIds] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [genres, setGenres] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIconClick = () => {
    navigate("/");
  };

  const handleCinebergScale = (scale) => {
    setCinebergScale(scale);
    const scaleLabels = {
      1: "Tip of the Iceberg Movies",
      2: "Niche Movies",
      3: "Underground Movies",
      4: "No Filter",
    };
    setSelectedScaleLabel(scaleLabels[scale] || "Select Scale");
  };

  const handleFlip = (movie) => {
    setFlipped((prevFlippedMovie) =>
      prevFlippedMovie === movie ? null : movie
    );
    if (movie) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  const handleSearchClick = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/recommend_movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm, cinebergScale }),
      });
      if (response.ok) {
        const movieIds = await response.json();
        setMovieIds(movieIds);
      } else {
        console.error("Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/recommend_movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerm, cinebergScale }),
        });
        if (response.ok) {
          const movieIds = await response.json();
          setMovieIds(movieIds);
        } else {
          console.error("Failed to fetch recommendations");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchMoviesDetails = async () => {
      if (movieIds.length > 0) {
        const api_key = process.env.REACT_APP_TMDB_KEY;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + api_key,
          },
        };
        const updatedMovies = await Promise.all(
          movieIds.map(async (movieId) => {
            const url =
              "https://api.themoviedb.org/3/movie/" +
              movieId +
              "language=en-US";
            const response = await fetch(url, options);
            return response.json();
          })
        );
        setRecommendedMovies(updatedMovies);
      }
    };

    fetchMoviesDetails();
  }, [movieIds]);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + api_key,
      },
    };

    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  return (
    <div>
      <div className="main-text" onClick={handleIconClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
          alt="Cineberg-Icon"
        />

        <h1>Cineberg</h1>

        <h3>Movie Recommender</h3>
      </div>

      <div className="search">
        <div className="paste-button" onClick={handleDropDown}>
          <button className="button">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
              alt="Cineberg-Icon"
            />
            <div className="selected-scale">{selectedScaleLabel}</div>
            <div className="triangle">▼</div>
          </button>

          {dropDown && (
            <div className="dropdown-content">
              <button className="top" onClick={() => handleCinebergScale("1")}>
                Tip of the Iceberg Movies
              </button>
              <button
                className="middle"
                onClick={() => handleCinebergScale("2")}
              >
                Niche Movies
              </button>
              <button
                className="middle"
                onClick={() => handleCinebergScale("3")}
              >
                Underground Movies
              </button>
              <button
                className="bottom"
                onClick={() => handleCinebergScale("4")}
              >
                No Filter
              </button>
            </div>
          )}
        </div>

        <div className="recommendation-search-button" onKeyDown={handleKeyDown}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What type of movie would you like to see? :)"
          />

          <img
            src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
            alt="search"
            onClick={handleSearchClick}
          />
        </div>
      </div>

      {loading && (
        <>
          <div className="loading">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="loading-text">Searching through the iceberg...</p>
        </>
      )}

      {recommendedMovies.length > 0 && (
        <div className="recommended-movies-frame">
          <div className="header">
            <h2>Movies Recommended 4 You {"<3"}:</h2>
          </div>

          <div className="recommended-container-movie">
            {recommendedMovies.map((movie, index) => (
              <div key={index}>
                <h3 className="recommended-movie-title">{index + 1}.</h3>
                <div onClick={() => handleFlip(movie)}>
                  <MovieCard movie={movie} />
                </div>
              </div>
            ))}
          </div>

          {flipped && (
            <>
              <div onClick={() => handleFlip(null)} className="overlay"></div>
              <div className="container-flipped">
                {recommendedMovies.map((movieIds) => (
                  <MovieCardFlipped
                    key={movieIds.id}
                    movie={flipped}
                    genres={genres}
                    onFlip={handleFlip}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieRecommender;
