import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import MovieCardFlipped from './MovieCardFlipped';


const Homepage = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [genres, setGenres] = useState([]);

    const handleFlip = (movie) => {
        setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
        if (movie) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
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

    return (
        <>
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
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for movies"
                />

                <img
                src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
                alt="search"
                // onClick={() => searchMovies(searchTerm)}
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
                )};
        </>       
    );
}

export default Homepage;
