import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import MovieCardFlipped from "./MovieCardFlipped";
import MovieCard from "./MovieCard";

const SearchPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(
    location.state?.searchTerm || ""
  );
  const [temporaryInput, setTemporaryInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const { userEmail, signOut } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleIconClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    setSearchTerm(temporaryInput);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchTerm(temporaryInput);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    signOut();
  };

  const handleProfileClick = () => {
    navigate('/profilepage');
  };

  useEffect(() => {
    if (searchTerm) {
      const api_key = process.env.REACT_APP_TMDB_KEY;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + api_key,
        },
      };

      fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          searchTerm +
          "&include_adult=false&language=en-US&page=1",
        options
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedResults = data.results.sort(
            (a, b) => b.vote_count - a.vote_count || b.popularity - a.popularity
          );
          setSearchResults(sortedResults);
        })
        .catch((err) => console.error(err));
    }
  }, [searchTerm]);

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

  return (
    <>
      <div className="main-text">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
          alt="Cineberg-Icon"
          onClick={handleIconClick}
        />

        <h1 onClick={handleIconClick}>Cineberg</h1>

        {userEmail !== null ? (
          <div className='loggedin'>
            <img 
              src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" 
              alt="logged in icon" 
              onClick={handleProfileClick}
            />
            <button onClick={handleLogoutClick}>logout</button>
          </div>
        ) : (
          <div className='login' onClick={handleLoginClick}>
            <h1>LOGIN</h1>
          </div>
        )}
      </div>

      <div className="search-button" onKeyDown={handleKeyDown}>
        <input
          value={temporaryInput}
          onChange={(e) => setTemporaryInput(e.target.value)}
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
          <h2>
            Search Results for <span className="search-term">{searchTerm}</span>{" "}
            :
          </h2>
        </div>

        <div className="container-movie-grid">
          {searchResults.map((movie) => (
            <div key={movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {flipped && (
          <>
            <div onClick={() => handleFlip(null)} className="overlay"></div>
            <div className="container-flipped">
              {searchResults.map((movie) => (
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
      </div>

      <div className="searchpage-nav-bar">
        <h6 className="searchpage-cineberg-features">Cineberg Features</h6>

        <ul style={{ listStyleType: "none" }}>
          <li onClick={() => handleNavigate("/recommender")}>Movie Recommender</li>
          <li onClick={() => handleNavigate("/news")}>Latest News</li>
          <li onClick={() => handleNavigate("/toprated")}>All Time Top Rated</li>
          <li onClick={() => handleNavigate("/tipoficeberg")}>Tip of the Iceberg Movies</li>
          <li onClick={() => handleNavigate("/niche")}>Niche Movies</li>
          <li onClick={() => handleNavigate("/underground")}>Underground Movies</li>
        </ul>

        <h6 className="searchpage-genres">Genres</h6>
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

export default SearchPage;
