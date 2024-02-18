import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { auth, provider } from '../firebase';
// import { signInWithPopup } from "firebase/auth";
import MovieCard from './MovieCard';
import MovieCardFlipped from './MovieCardFlipped';
import LoginPage from './LoginPage';


const Homepage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleIconClick = () => {
    navigate('/');
  };

  const handleSearchClick = () => {
    navigate('/search', { state: { searchTerm } });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleFlip = (movie) => {
    setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
    if (movie) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
  };

  const handleLoginPage = () => setShowLoginPage(!showLoginPage);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + api_key
    }};

    fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
      .then(response => response.json())
      .then(data => {
        setTrendingMovies(data.results);
      })
      .catch(err => console.error(err));

    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
    .then(response => response.json())
    .then(data => {
      setNowPlayingMovies(data.results);
    })
    .catch(err => console.error(err));

    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
    .then(response => response.json())
    .then(data => {
      setUpcomingMovies(data.results);
    })
    .catch(err => console.error(err));

    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(response => response.json())
    .then(data => {
      setGenres(data.genres);
    })
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (showLoginPage) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showLoginPage])

  // const handleAuth = () => {
  //   signInWithPopup(auth, provider).then((result) => {
  //     const user = result.user;
  //     console.log(user);
  //   })
  // };

  return (
    <>
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

      <div className='login' onClick={handleLoginPage}>
        <h1>LOGIN</h1>
      </div>
      {showLoginPage && (
        <div className='login-overlay'>
          <LoginPage />
        </div>
      )}

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

      <div className = "frame">
        <div className = "subtitle">
          <h2>Trending Movies: </h2>
        </div>

        <div className = "container-movie">
          {trendingMovies.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div>

        <div className = "subtitle">
          <h2>Now Playing: </h2>
        </div>

        <div className = "container-movie">
          {nowPlayingMovies.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div>

        <div className = "subtitle">
          <h2>Upcoming Movies: </h2>
        </div>

        <div className = "container-movie">
          {upcomingMovies.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div>
      </div>

      {flipped && (
        <>
          <div onClick={() => handleFlip(null)} className = "overlay"></div>
            <div className = "container-flipped">
                {trendingMovies.map((movie) => (
                <MovieCardFlipped 
                    key = {movie.id} 
                    movie={flipped}
                    genres={genres}
                    onFlip={handleFlip}
                />
                ))}
            </div>
        </>
      )}

      <div className = "nav-bar">
        <h6 className = "cineberg-features">
          Cineberg Features
        </h6>
        <ul style={{ listStyleType: 'none' }}>
          <li onClick={() => handleNavigate('/recommender')}>Movie Recommender</li>
          <li onClick={() => handleNavigate('/news')}>Latest News</li>
          <li onClick={() => handleNavigate('/toprated')}>All Time Top Rated</li>
          <li onClick={() => handleNavigate('/tipoficeberg')}>Tip of the Iceberg Movies</li>
          <li onClick={() => handleNavigate('/niche')}>Niche Movies</li>
          <li onClick={() => handleNavigate('/underground')}>Underground Movies</li>
        </ul>
        <h6 className="genres">
          Genres
        </h6>
        <ul style={{ listStyleType: 'none' }}>
          <li onClick={() => handleNavigate('/action')}>Action</li>
          <li onClick={() => handleNavigate('/adventure')}>Adventure</li>
          <li onClick={() => handleNavigate('/animation')}>Animation</li>
          <li onClick={() => handleNavigate('/comedy')}>Comedy</li>
          <li onClick={() => handleNavigate('/crime')}>Crime</li>
          <li onClick={() => handleNavigate('/documentary')}>Documentary</li>
          <li onClick={() => handleNavigate('/drama')}>Drama</li>
          <li onClick={() => handleNavigate('/family')}>Family</li>
          <li onClick={() => handleNavigate('/fantasy')}>Fantasy</li>
          <li onClick={() => handleNavigate('/history')}>History</li>
          <li onClick={() => handleNavigate('/horror')}>Horror</li>
          <li onClick={() => handleNavigate('/music')}>Music</li>
          <li onClick={() => handleNavigate('/mystery')}>Mystery</li>
          <li onClick={() => handleNavigate('/romance')}>Romance</li>
          <li onClick={() => handleNavigate('/scifi')}>Science Fiction</li>
          <li onClick={() => handleNavigate('/tvmovie')}>TV Movie</li>
          <li onClick={() => handleNavigate('/thriller')}>Thriller</li>
          <li onClick={() => handleNavigate('/war')}>War</li>
          <li onClick={() => handleNavigate('/western')}>Western</li>
        </ul>
      </div>
    </>       
  );
}

export default Homepage;
