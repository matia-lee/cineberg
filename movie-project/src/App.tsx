import MovieCard from './MovieCard';
import { useState, useEffect } from 'react';
import './App.css';
  

interface Movie {
  id: number;
}

const App = () => {

  // const [movies, setMovies] = useState([]);
  const [movies, setMovies] = useState<Movie[]>([]);

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

        <div className = "container">
          {movies.map((movie) => (
            <MovieCard 
              key = {movie.id} 
              movie={movie} 
            />
          ))}
        </div>
      </div>
    </div>
  );
  }

export default App;
