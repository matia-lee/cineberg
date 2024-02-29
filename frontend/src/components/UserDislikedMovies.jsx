import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import MovieCardFlipped from "./MovieCardFlipped";
import MovieCard from "./MovieCard";

const UserDislikedMovies = () => {
  const [movieIds, setMovieIds] = useState([]);
  const [dislikedMovies, setDislikedMovies] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [genres, setGenres] = useState([]);
  const [containerViewHeight, setContainerViewHeight] = useState("78.5vh")
  const { username, signOut } = useAuth();
  const movieRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/');
  };

  const handleLogoutClick = () => {
    signOut();
    navigate('/');
  };

  const handleWatchedClick = () => {
    navigate('/profilepage');
  };

  const handleLikedClick = () => {
    navigate('/profilelikedmovies');
  };

  const handleRecommendedMovies = () => {
    navigate('/recommendedmovies');
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
    if (movieRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      setContainerViewHeight(`${containerHeight + 30}px`);
    }
  }, [dislikedMovies]);

  useEffect (() => {
    fetch(`http://localhost:5000/get_disliked_movie_ids?username=${encodeURIComponent(username)}`)
      .then((response) => response.json())
      .then((data) => setMovieIds(data))
      .catch ((error) => console.log("Error fetching liked ids: ", error));
  }, [username]);

  useEffect (() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + api_key,
      },
    };

    if (movieIds.length > 0) {
      const fetchMovieDetails = async () => {
        const movieDetailsPromises = movieIds.map(id => 
          fetch("https://api.themoviedb.org/3/movie/" + id + "?language=en-US", options)
            .then(response => {
              return response.json();
            })
        );

        try {
          const movies = await Promise.all(movieDetailsPromises);
          setDislikedMovies(movies);
        } catch (error) {
          console.error("Error fetching disiked movie details: ", error);
        }
      };
      fetchMovieDetails();
    }
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

  return (
    <div>
      <div className = "main-text">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
          alt="Cineberg-Icon" 
          onClick={handleIconClick}
        />

        <h1 onClick={handleIconClick}>
          Cineberg
        </h1>
      </div> 

      <div className='logout' onClick={handleLogoutClick}>
        <h1>LOGOUT</h1>
      </div>

      <div className="menu">
        <h1>
          Welcome <span className="username">{username}</span>!
        </h1>
        <ul style={{ listStyleType: 'none' }}>
          <li onClick={handleWatchedClick}>Watched Movies</li>
          <li onClick={handleLikedClick}>Liked Movies</li>
          <li>Disliked Movies</li>
          <li onClick={handleRecommendedMovies}>Movies For You</li>
        </ul>
      </div>

      <div className="movie-user-grid" style={{ minHeight: containerViewHeight }}>
        <div className="subtitle">
          <h2>Disliked Movies:</h2>
        </div>

        <div className="container-user-grid" ref={containerRef}>
          {dislikedMovies.map((movie) => (
            <div key={movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {flipped && (
          <>
            <div onClick={() => handleFlip(null)} className="overlay"></div>
            <div className="container-flipped">
              {dislikedMovies.map((movie) => (
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
    </div>
  );
};

export default UserDislikedMovies;
