import React from 'react';
import MovieCard from './MovieCard';
import { useState, useEffect } from 'react';
import './App.css';


// const api_key = process.env.REACT_APP_TMDB_API;

// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer ' + api_key
//   }
// };

// fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));


// const App = () => {
//   const [movies, setMovies] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const searchMovies = async (title:string) => {
//     const response = await fetch(`${API_URL}&s=${title}`);
//     const data = await response.json();
    
//     setMovies(data.Search);
//   }

//   useEffect(() => {
//     searchMovies('Everything Everywhere All At Once');
//   },[])

//   return (
//     <div className = 'app'>
//       <h1>MovieLand</h1>

//       <div className = "search">
//         <input 
//           placeholder="Search for movies" 
//           value = {searchTerm}
//           onChange = {(e) => setSearchTerm(e.target.value)}
//         />
//         <img 
//           src={SearchIcon} 
//           alt="search" 
//           onClick = {() => searchMovies(searchTerm)}
//         />
//       </div>

      // {movies?.length > 0 ? (
      //   <div className = "container">
      //     {movies.map((movie) => (
      //       <MovieCard key = {movie.id} movie={movie} />
      //     ))}
      //   </div>
      // ) :(
      //   <div className = "empty">
      //     <h2></h2>
      //   </div>
      // )
      // } 


//     </div>
//   );
// }

// export default App;

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
        // Authorization: 'Bearer ' + api_key
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTA3YzMyNTczMjZmYjliMGZhOWQ0NmZhZjRjMTBkZCIsInN1YiI6IjY1NDZhYzQxMjg2NmZhMDBjNDI0MDRmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bDOlrA_ZPVUKQ7asRdM_VyXg1O6IwmGbpn4GmB0FzoE'
      }
    };

    fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
      .then(response => response.json())
      .then(data => {
        setMovies(data.results);
      })
      .catch(err => console.error(err));
  }, []); 

  return(
    <div className = "app">
      <h1 className = "main-text">Cineberg</h1>

      <div className = "container">
            {movies.map((movie) => (
              <MovieCard key = {movie.id} movie={movie} />
            ))}
          </div>
    </div>

  );
}

export default App;