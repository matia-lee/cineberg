import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import MovieCardFlipped from './MovieCardFlipped';
import MovieCard from "./MovieCard";


const SearchPage = () => {    

    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
    const [temporaryInput, setTemporaryInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    const handleIconClick = () => {
        navigate('/');
    }

    const handleSearchClick = () => {
        setSearchTerm(temporaryInput);
      };

    const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        setSearchTerm(temporaryInput);
    }
    };

    useEffect(() => {
        if (searchTerm) {
            const api_key = process.env.REACT_APP_TMDB_KEY;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer ' + api_key
                }
            };

            fetch('https://api.themoviedb.org/3/search/movie?query=' + searchTerm + '&include_adult=false&language=en-US&page=1', options)
                .then(response => response.json())
                .then(data => {
                    const sortedResults = data.results.sort((a, b) => 
                        b.vote_count - a.vote_count || b.popularity - a.popularity);
                    setSearchResults(sortedResults);
                })
                .catch(err => console.error(err));
        }
    }, [searchTerm]);

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

    const handleFlip = (movie) => {
        setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
        if (movie) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };


    return (
    <>
        <div className = "main-text" onClick={handleIconClick}>
            <img
                src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
                alt="Cineberg-Icon" 
            />

            <h1>
                Cineberg
            </h1>
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
                    Search Results for <span className="search-term">{searchTerm}</span> :
                </h2>
            </div>

            <div className="container-movie-grid">
                {searchResults.map((movie) => (
                    <div key = {movie.id} onClick={() => handleFlip(movie)}>
                        <MovieCard movie={movie}/>
                    </div>
                ))}
            </div>

            {flipped && (
                <>
                    <div onClick={() => handleFlip(null)} className = "overlay"></div>
                    <div className = "container-flipped">
                        {searchResults.map((movie) => (
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
        </div>       
    </>
    );
}


export default SearchPage;