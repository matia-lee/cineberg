
const MovieCard = ({ movie }) => {    

    return (
    <div className = "movie">
        <div className = "release-date">
            <p>{new Date(movie.release_date).getFullYear()}</p>
        </div>

        <div className = "poster">
            <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', height: '100%' }}
            />
        </div>

        <div className = "title">
            <span>{movie.media_type ? movie.media_type : "MOVIE"}</span>
            <h3>{movie.title}</h3>
        </div>     
    </div>
);
}

export default MovieCard;
