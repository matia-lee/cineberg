import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import MovieCardFlipped from "./MovieCardFlipped";
import MovieCard from "./MovieCard";

const RecommendedMovies = () => {
  const [recommendedMovieIds, setRecommendedMovieIds] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [genres, setGenres] = useState([]);
  const { username, signOut } = useAuth();
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

  const handleDislikedClick = () => {
    navigate('/profiledislikedmovies');
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

  useEffect (() => {
    fetch(`http://localhost:5000/recommended_liked_movies?username=${encodeURIComponent(username)}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendedMovieIds(data);
        console.log(data);
      })
      .catch ((error) => console.log("Error fetching recommended ids: ", error));
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

    if (recommendedMovieIds.length > 0) {
      const fetchMovieDetails = async () => {
        const movieDetailsPromises = recommendedMovieIds.map(id => 
          fetch("https://api.themoviedb.org/3/movie/" + id + "?language=en-US", options)
            .then(response => {
              return response.json();
            })
        );

        try {
          const movies = await Promise.all(movieDetailsPromises);
          setRecommendedMovies(movies);
        } catch (error) {
          console.error("Error fetching liked movie details: ", error);
        }
      };
      fetchMovieDetails();
    }
  }, [recommendedMovieIds]);

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
          <li onClick={handleDislikedClick}>Disliked Movies</li>
          <li>Movies For You:</li>
        </ul>
      </div>
      <div className="movie-recommended-grid">
        <div className="subtitle">
          <h2>Based on the movies you've liked, you might enjoy:</h2>
        </div>

        <div className="container-movie-grid">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {flipped && (
          <>
            <div onClick={() => handleFlip(null)} className="overlay"></div>
            <div className="container-flipped">
              {recommendedMovies.map((movie) => (
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

export default RecommendedMovies;
