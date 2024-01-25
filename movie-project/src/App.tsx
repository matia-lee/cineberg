import MovieCard from './MovieCard';
import MovieCardFlipped from './MovieCardFlipped';
import SearchPage from './SearchPage';
import { useState, useEffect } from 'react';
import './MovieCard.css';
import './MovieCardFlipped.css';
import './Homepage.css'
  


interface Movie {
  id: number;
}

const App = () => {

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  // const [niche, setNiche] = useState<Movie[]>([]);
  const [flipped, setFlipped] = useState<Movie | null>(null);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [omdbMovies, setOmdbMovies] = useState([]);

  useEffect(() => {
      searchMovies("");
    }, []);

    const searchMovies = async (title: string) => {
      if (title === "") {
          setOmdbMovies([]);
          return;
      }
      const omdb_key = process.env.REACT_APP_OMDB_KEY;
      const API_URL = "http://www.omdbapi.com/?apikey=" + omdb_key
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      console.log(data);
      setOmdbMovies(data.Search);
  };

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
  }, []);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + api_key
      }
    };
    
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
      .then(response => response.json())
      .then(data => {
        setNowPlayingMovies(data.results);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + api_key
      }
    };
    
    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
      .then(response => response.json())
      .then(data => {
        setUpcomingMovies(data.results);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + api_key
      }
    };
    
    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
      .then(response => response.json())
      .then(data => {
        setTopRatedMovies(data.results);
      })
      .catch(err => console.error(err));
  })

  // useEffect (() => {
  //   const api_key = process.env.REACT_APP_TMDB_KEY;
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: 'Bearer ' + api_key
  //     }
  //   };
    
  //   const urlBase = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.asc&vote_count.gte=120&vote_count.lte=1900&with_keywords=258226%20%7C%20313730%20%7C%20263293%20%7C%20315905%20%7C%20314753%20%7C%20323722%20%7C%20319005%20%7C%20321897%20%7C%20324360%20%7C%20315053%20%7C%2011130%20%7C%20305431%20%7C%20276235%20%7C%20302191%20%7C%2011034%20%7C%20314104%20%7C%20247328%20%7C%20319320%20%7C%20237867%20%7C%20321288';

  //   Promise.all([
  //     fetch(`${urlBase}&page=1`, options).then(response => response.json()),
  //     fetch(`${urlBase}&page=2`, options).then(response => response.json())
  //   ])
  //   .then(([data1, data2]) => {
  //     setNiche([...data1.results, ...data2.results]);
  //   })
  //   .catch(err => console.error(err));
  // }, []);
  
  const handleFlip = (movie : Movie | null) => {
    setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
  };

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + api_key
    }};
  
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(response => response.json())
    .then(data => {
      setGenres(data.genres);
    })
    .catch(err => console.error(err));

    }, []);
  


  return(
    <div className = "app">
        <div className = "main-text">
            <img 
            src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
            alt="Cineberg-Icon" 
            />

            <h1>
            Cineberg
            </h1>
        </div>

        <div className="search-button">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />

        <button onClick={() => searchMovies(searchTerm)}></button>
        {/* <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        /> */}
        </div>

        <div className="container-movie">
          {omdbMovies.map((movie) => (
            <div>
              <SearchPage movie={movie} />
            </div>
            ))}
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

        <div className = "subtitle">
          <h2>Top Rated Movies: </h2>
        </div>

        <div className = "container-movie">
          {topRatedMovies.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div>

        {/* <div className = "subtitle">
          <h2>Niche Sh*t: </h2>
        </div>

        <div className = "container-movie">
          {niche.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div> */}
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

    </div>
  );
  }

export default App;