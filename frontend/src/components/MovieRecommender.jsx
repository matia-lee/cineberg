import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import MovieCardFlipped from './MovieCardFlipped';


const MovieRecommender = () => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [movieIds, setMovieIds] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [genres, setGenres] = useState([]);
    const handleIconClick = () => {
        navigate('/');
    };

    const handleFlip = (movie) => {
        setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
        if (movie) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };

    const handleSearchClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/recommend_movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm }),
            });
            if (response.ok) {
                const movieIds = await response.json();
                setMovieIds(movieIds);
            } else {
                console.error('Failed to fetch recommendations');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchMoviesDetails = async () => {
            if (movieIds.length > 0) {
                const api_key = process.env.REACT_APP_TMDB_KEY;
                const options = {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      Authorization: 'Bearer ' + api_key,
                    },
                };
                const updatedMovies = await Promise.all(movieIds.map(async (movieId) => {
                    const url = 'https://api.themoviedb.org/3/movie/' + movieId + 'language=en-US';
                    const response = await fetch(url, options);
                    return response.json();
                }));
                setRecommendedMovies(updatedMovies);
            }
        };

        fetchMoviesDetails();
    }, [movieIds]);


    useEffect (() => {
        const api_key = process.env.REACT_APP_TMDB_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + api_key
            }
            };

        fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
        .then(response => response.json())
        .then(data => {
          setGenres(data.genres);
        })
        .catch(err => console.error(err));
    }, [])

    return(
        <div>
            <div className = "main-text" onClick={handleIconClick}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
                    alt="Cineberg-Icon" 
                />

                <h1>
                    Cineberg
                </h1>

                <h3>
                    Movie Recommender
                </h3>
            </div> 

            <div className="paste-button">
                <button className="button">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
                        alt="Cineberg-Icon" 
                    />
                    <div className="triangle">
                        ▼
                    </div>
                </button>
                <div className="dropdown-content">
                    <a href id="top">Tip of the Iceberg movies</a>
                    <a href id="middle">Niche Movies</a>
                    <a href id="bottom">Underground Movies</a>
                </div>
            </div>

            <div className="recommendation-search-button">
                <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="What type of movie would you like to see? :)"
                />

                <img
                    src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
                    alt="search"
                    onClick={handleSearchClick}
                />
            </div>

            {/* <div className = "subtitle">
                <h2>Upcoming Movies: </h2>
            </div> */}

            <div className = "container-movie">
                {recommendedMovies.map((movie) => (
                    <div key = {movie.id} onClick={() => handleFlip(movie)}>
                    <MovieCard movie={movie}/>
                    </div>
                ))}
            </div>

            {flipped && (
                <>
                <div onClick={() => handleFlip(null)} className = "overlay"></div>
                    <div className = "container-flipped">
                        {recommendedMovies.map((movieIds) => (
                        <MovieCardFlipped 
                            key = {movieIds.id} 
                            movie={flipped}
                            genres={genres}
                            onFlip={handleFlip}
                        />
                        ))}
                    </div>
                </>
            )};
        </div>
    )
};

export default MovieRecommender;