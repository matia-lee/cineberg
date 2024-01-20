import { useState, useEffect } from 'react';



const MovieCard = ({ movie }) => {
    const [flipped, setFlipped] = useState(false);
    const [genres, setGenres] = useState([]);

    const handleFlip = () => {
        setFlipped(!flipped)
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

    let cinebergRating;
    const popularity = movie.popularity
    if (popularity >= 0 && popularity <= 9)
    {
        cinebergRating = "Underground Sh*t"
    }
    else if (popularity >= 10 && popularity <= 17)
    {
        cinebergRating = "Niche Sh*t"
    }
    else if (popularity >= 18)
    {
        cinebergRating = "Tip of the Iceberg Sh*t"
    }
    


    return (
    <div className = {"movie" + (flipped ? "-flipped" : "")} onClick={handleFlip}>
        {!flipped && (
            <>
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
            </>
        )}

        {flipped && 
            <div className = "container">
                <div className = "title">
                    <h3>{movie.title}</h3>
                </div>

                <div className = "overview">
                    <p>{movie.overview}</p>
                </div>

                <div className = "backdrop">
                    <img 
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                    alt="movie backdrop"
                    style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <div className = "genre">
                    <h4>
                        {movie.genre_ids.map(
                            id => 
                                genres.find(genre => genre.id === id).name
                            ).join(", ")
                        }
                    </h4>
                </div>

                <div className = "ratings">
                    <h5>{movie.vote_average}</h5>
                </div>

                <div className = "cineberg-rating">
                    <h5>{cinebergRating}</h5>
                </div>
            </div>
        }
    </div>
);
}

  

export default MovieCard;