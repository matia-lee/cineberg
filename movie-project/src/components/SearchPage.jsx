import { useState, useEffect } from "react";
import MovieCardFlipped from './MovieCardFlipped';


const SearchPage = () => {    

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTitle, setSearchTitle] = useState([]);
    // const [searchPerson, setSearchPerson] = useState([]);
    const [flipped, setFlipped] = useState(null);
    const [genres, setGenres] = useState([]);

    useEffect (() => {
        searchMovies("");
    }, []);
        
    const searchMovies = async (title) => {
        if (title === "") {
            setSearchTitle([]);
            return;
        }
        const api_key = process.env.REACT_APP_TMDB_KEY;
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + api_key
            }
          };
          
        //   const personUrl = 'https://api.themoviedb.org/3/search/person?query=' + title + '&include_adult=false&language=en-US&page=1'
        //   const titleUrl = 'https://api.themoviedb.org/3/search/movie?query=' + title + '&include_adult=false&language=en-US&page=1'

        //   Promise.all([
        //   fetch(personUrl, options).then(response => response.json()),
        //   fetch(titleUrl, options).then(response => response.json())
        //   ])
        //   .then(([data1, data2]) => {
        //   setSearchTitle([...data1.results, ...data2.results]);
        //   })



        // fetch('https://api.themoviedb.org/3/search/person?query=' + title + '&include_adult=false&language=en-US&page=1', options)
        //     .then(response => response.json())
        //     .then(data => {
        //         setSearchTitle(data.known_for);
        //     })
        //     .catch(err => console.error(err));
            




        fetch('https://api.themoviedb.org/3/search/movie?query=' + title + '&include_adult=false&language=en-US&page=1', options)
        .then(response => response.json())
        .then(data => {
            const sortedResults = data.results.sort((a, b) => 
                b.vote_count - a.vote_count || b.popularity - a.popularity);
            setSearchTitle(sortedResults);
        })
        .catch(err => console.error(err));
    }

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
        <div className="search-button">
            <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies"
            />

            {/* <button onClick={() => searchMovies(searchTerm)}></button> */}
            <img
            src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
            alt="search"
            onClick={() => searchMovies(searchTerm)}
            />
        </div>
        
        <div className="container-movie">
          {searchTitle.map((movie) => ( 
            <div key = {movie.id} onClick={() => handleFlip(movie)} className = "movie">
                <div className = "release-date">
                    <p>{movie.release_date}</p>
                </div>

                <div className = "poster">
                    <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className = "title">
                    <span>{movie.media_type}</span>
                    <h3>{movie.title}</h3>
                </div>     
            </div>
            ))}
        </div>

        {flipped && (
            <>
                <div onClick={() => handleFlip(null)} className = "overlay"></div>
                <div className = "container-flipped">
                    {searchTitle.map((movie) => (
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


export default SearchPage;