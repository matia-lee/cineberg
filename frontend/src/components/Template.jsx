import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import MovieCardFlipped from "./MovieCardFlipped";

const Template = ({ endpoint, subtitle }) => {
  const [movies, setMovies] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    navigate("/search", { state: { searchTerm } });
  };

  const handlePageClick = (newPage) => {
    setPage(newPage);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
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

    fetch(`https://api.themoviedb.org/3${endpoint}&page=${page}`, options)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => console.error(err));
  }, [endpoint, page]);

  return (
    <>
      <div className="main-text">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
          alt="Cineberg-Icon"
          onClick={handleIconClick}
        />

        <h1 onClick={handleIconClick}>Cineberg</h1>
      </div>

      <div className="search-button" onKeyDown={handleKeyDown}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />

        <img
          src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
          alt="search"
          onClick={handleSearchClick}
        />
      </div>

      <div className="movie-search-grid">
        <div className="subtitle">
          <h2>{subtitle} </h2>
        </div>

        <div className="container-movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <div className="footer">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <span
              key={number}
              onClick={() => handlePageClick(number)}
              className={page === number ? "current-page" : ""}
            >
              {number}
            </span>
          ))}
        </div>
      </div>

      {flipped && (
        <>
          <div onClick={() => handleFlip(null)} className="overlay"></div>
          <div className="container-flipped">
            {movies.map((movie) => (
              <MovieCardFlipped
                key={movie.id}
                movie={flipped}
                genres={genres}
                onFlip={handleFlip}
              />
            ))}
          </div>
        </>
      )}

      <div className="template-nav-bar">
        <h6 className="template-cineberg-features">Cineberg Features</h6>

        <ul style={{ listStyleType: "none" }}>
          <li onClick={() => handleNavigate("/recommender")}>Movie Recommender</li>
          <li onClick={() => handleNavigate("/news")}>Latest News</li>
          <li onClick={() => handleNavigate("/toprated")}>All Time Top Rated</li>
          <li onClick={() => handleNavigate("/tipoficeberg")}>Tip of the Iceberg Movies</li>
          <li onClick={() => handleNavigate("/niche")}>Niche Movies</li>
          <li onClick={() => handleNavigate("/underground")}>Underground Movies</li>
        </ul>

        <h6 className="template-genres">Genres</h6>
        <ul style={{ listStyleType: "none" }}>
          <li onClick={() => handleNavigate("/action")}>Action</li>
          <li onClick={() => handleNavigate("/adventure")}>Adventure</li>
          <li onClick={() => handleNavigate("/animation")}>Animation</li>
          <li onClick={() => handleNavigate("/comedy")}>Comedy</li>
          <li onClick={() => handleNavigate("/crime")}>Crime</li>
          <li onClick={() => handleNavigate("/documentary")}>Documentary</li>
          <li onClick={() => handleNavigate("/drama")}>Drama</li>
          <li onClick={() => handleNavigate("/family")}>Family</li>
          <li onClick={() => handleNavigate("/fantasy")}>Fantasy</li>
          <li onClick={() => handleNavigate("/history")}>History</li>
          <li onClick={() => handleNavigate("/horror")}>Horror</li>
          <li onClick={() => handleNavigate("/music")}>Music</li>
          <li onClick={() => handleNavigate("/mystery")}>Mystery</li>
          <li onClick={() => handleNavigate("/romance")}>Romance</li>
          <li onClick={() => handleNavigate("/scifi")}>Science Fiction</li>
          <li onClick={() => handleNavigate("/tvmovie")}>TV Movie</li>
          <li onClick={() => handleNavigate("/thriller")}>Thriller</li>
          <li onClick={() => handleNavigate("/war")}>War</li>
          <li onClick={() => handleNavigate("/western")}>Western</li>
        </ul>
      </div>
    </>
  );
};

export default Template;
