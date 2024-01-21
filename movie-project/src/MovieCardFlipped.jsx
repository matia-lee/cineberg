const MovieCardFlipped = ({ movie, genres }) => {

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
        <div className = "container">

            <div className = "title">
                <h2>{movie.title}</h2>
            </div>

            <div className = "overview">
                <h3>Overview:</h3>
                <p>{movie.overview}</p>
            </div>

            <div className = "backdrop">
                <img 
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                alt="movie backdrop"
                style={{ width: '100%', height: '100%' }}
                />
            </div>

            <div className = "flipped-poster">
                <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '100%' }}
                />
            </div>

            <div className = "genre">
                <h4>
                    {movie.genre_ids.map(
                        id => 
                            genres.find(genre => genre.id === id).name
                        ).join(" ")
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
    )
};
  
export default MovieCardFlipped;