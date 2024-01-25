const SearchPage = ({ movie }) => {    

    return (
    <div className = "movie">
        <div className = "release-date">
            <p>{movie.Year}</p>
        </div>

        <div className = "poster">
            <img
            src={movie.Poster}
            alt={movie.title}
            style={{ width: '100%', height: '100%' }}
            />
        </div>

        <div className = "title">
            <span>{movie.Type}</span>
            <h3>{movie.Title}</h3>
        </div>     
    </div>
);
}

export default SearchPage;