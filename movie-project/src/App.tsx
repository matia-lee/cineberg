import MovieCard from './MovieCard';
import MovieCardFlipped from './MovieCardFlipped';
import { useState, useEffect } from 'react';
import './App.css';
  

interface Movie {
  id: number;
}

const App = () => {

  const [movies, setMovies] = useState<Movie[]>([])
  const [flipped, setFlipped] = useState<Movie | null>(null);
  const [genres, setGenres] = useState([]);

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
        setMovies(data.results);
      })
      .catch(err => console.error(err));
  }, []);
  
  const handleFlip = (movie : Movie) => {
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
          alt="Icon" 
        />
        <h1>
          Cineberg
        </h1>
      </div>

      <div className = "frame">
        <div className = "subtitle">
          <h2>Trending Movies: </h2>
        </div>

        <div className = "container-movie">
          {movies.map((movie) => (
            <div key = {movie.id} onClick={() => handleFlip(movie)}>
              <MovieCard movie={movie}/>
            </div>
          ))}
        </div>
      </div>

      {flipped && (
        <div className = "container-flipped">
        {movies.map((movie) => (
          <MovieCardFlipped 
            key = {movie.id} 
            movie={flipped}
            genres={genres}
          />
        ))}
        </div>
      )}

    </div>
  );
  }

export default App;