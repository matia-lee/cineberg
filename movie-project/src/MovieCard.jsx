

const MovieCard = ({ movie }) => {
    return (
    <div className = "movie">
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
);
}

  

export default MovieCard;