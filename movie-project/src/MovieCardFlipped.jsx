import { useEffect, useState, useRef } from 'react';

const MovieCardFlipped = ({ movie, genres }) => {
    const [credits, setCredits] = useState([]);
    const [overviewPaddingTop, setOverviewPaddingTop] = useState('0px');
    const [creditsPaddingTop, setCreditsPaddingTop] = useState('0px');
    const titleRef = useRef(null);
    const overviewRef = useRef(null);

    useEffect(() => {
        if (titleRef.current) {
            const titleHeight = titleRef.current.offsetHeight;
            setOverviewPaddingTop(`${titleHeight + 130}px`);
        }
    }, [movie]);

    useEffect(() => {
        if (titleRef.current && overviewRef.current) {
            const titleHeight = titleRef.current.offsetHeight;
            const overviewHeight = overviewRef.current.offsetHeight;
            setCreditsPaddingTop(`${titleHeight + overviewHeight + 200}px`);
        }
    }, [movie]);

    useEffect(() => {
        const api_key = process.env.REACT_APP_TMDB_KEY;
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + api_key
            }
          };
          
          fetch('https://api.themoviedb.org/3/movie/' + movie.id + '/credits?language=en-US', options)
            .then(response => response.json())
            .then(data => {
                console.log(data.cast)
                setCredits(data.cast.slice(0, 5));
            })
            .catch(err => console.error(err));
    }, [movie.id]);



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

            <div className = "title" ref={titleRef}>
                <h2>{movie.title}</h2>
            </div>

            <div className = "overview" style={{ marginTop: overviewPaddingTop }} >
                <h3>Overview:</h3>
                <p ref={overviewRef}>{movie.overview}</p>
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

            <div className="credits-container" style={{ marginTop: creditsPaddingTop }}>
                {credits.map(person => (
                    
                    <div key={person.id} className="cast-container">

                        <div className="cast-profile-pic">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                alt={person.name}
                            />
                        </div>

                        <div className="cast-name">
                            <p>{person.name}</p>
                        </div>

                        <div className="character-name">
                            <p>{person.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};
  
export default MovieCardFlipped;