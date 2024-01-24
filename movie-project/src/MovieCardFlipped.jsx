import { useEffect, useState, useRef } from 'react';

const MovieCardFlipped = ({ movie, genres, onFlip }) => {
    const [credits, setCredits] = useState([]);
    const [tagline, setTagline] = useState([]);
    // const [runtime, setRuntime] = useState([]);
    const [overviewPaddingTop, setOverviewPaddingTop] = useState('0px');
    const [ratingsPaddingTop, setRatingsPaddingTop] =useState('0px');
    const [creditsPaddingTop, setCreditsPaddingTop] = useState('0px');
    const [genresPaddingTop, setGenresPaddingTop] = useState('0px');
    const titleRef = useRef(null);
    const overviewRef = useRef(null);
    const ratingsRef = useRef(null);
    const taglineRef = useRef(null);
    const posterRef = useRef(null);


    useEffect(() => {
        if (titleRef.current) {
            const titleHeight = titleRef.current.offsetHeight;
            setOverviewPaddingTop(`${titleHeight + 70}px`);
        }
    }, [movie]);

    useEffect(() => {
        if (titleRef.current && overviewRef.current) {
            const titleHeight = titleRef.current.offsetHeight;
            const overviewHeight = overviewRef.current.offsetHeight;
            setRatingsPaddingTop(`${titleHeight + overviewHeight + 125}px`);
        }
    }, [movie]);

    useEffect(() => {
        if (titleRef.current && overviewRef.current && ratingsRef.current) {
            const titleHeight = titleRef.current.offsetHeight;
            const overviewHeight = overviewRef.current.offsetHeight;
            const ratingsHeight = ratingsRef.current.offsetHeight;
            setCreditsPaddingTop(`${titleHeight + overviewHeight + ratingsHeight + 130}px`);
        }
    }, [movie]);

    // useLayoutEffect(() => {
    //     console.log("Movie object updated:", movie);

    //     if (taglineRef.current && posterRef.current) {
    //         const taglineHeight = taglineRef.current.offsetHeight;
    //         const posterHeight = posterRef.current.offsetHeight;
    //         setGenresPaddingTop(`${taglineHeight + posterHeight + 120}px`)

    //         console.log("Tagline Height:", taglineHeight);
    //         console.log("Poster Height:", posterHeight);
    //         console.log("Genres Padding Top:", genresPaddingTop);
    //     }
    // }, [movie]);

    useEffect(() => {
        const updatePaddingTop = () => {
            if (taglineRef.current && posterRef.current) {
                const taglineHeight = taglineRef.current.offsetHeight;
                const posterHeight = posterRef.current.offsetHeight;
                setGenresPaddingTop(`${taglineHeight + posterHeight + 123}px`);
            }
            else {
                setGenresPaddingTop('90px');
            }
        };

        updatePaddingTop();
    
        const taglineObserver = new MutationObserver(updatePaddingTop);
        if (taglineRef.current) {
            taglineObserver.observe(taglineRef.current, { childList: true, subtree: true });
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
                setCredits(data.cast.slice(0, 5));
            })
            .catch(err => console.error(err));
    }, [movie.id]);

    useEffect(() => {
        const api_key = process.env.REACT_APP_TMDB_KEY;
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer ' + api_key
            }
          };
          
          fetch('https://api.themoviedb.org/3/movie/' + movie.id + '?language=en-US', options)
            .then(response => response.json())
            .then(data => {
                setTagline(data.tagline);
                // setRuntime(data.runtime);
            })
            .catch(err => console.error(err));
    }, [movie.id]);

    let cinebergRating;
    const popularity = movie.popularity
    if (popularity >= 0 && popularity <= 9)
    {
        cinebergRating = "Underground"
    }
    else if (popularity >= 10 && popularity <= 17)
    {
        cinebergRating = "Niche"
    }
    else if (popularity >= 18)
    {
        cinebergRating = "Tip of the Iceberg"
    }

    const averageVote = Math.round((parseFloat(movie.vote_average)) * 10) / 10;

    return (
        <div className = "container">

            {/* <button onClick={() => onFlip(null)} className="exit-button">X</button> */}

            <div className = "title-runtime">
                <div className = "title" ref={titleRef}>
                    <h2>{movie.title}</h2>
                    {/* <h3>({<p>{new Date(movie.release_date).getFullYear()}</p>})</h3> */}
                    {/* <div className="runtime">
                        <h6>{runtime}</h6>
                        <p>mins</p>
                    </div> */}
                </div>
            </div>

            <div className="tagline" ref={taglineRef}>
                <h3>{tagline}</h3>
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

            <div className = "flipped-poster" ref={posterRef}>
                <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '100%' }}
                />
            </div>

            <div className="genre"  style={{ marginTop: genresPaddingTop }}>
                <h4>
                    {movie.genre_ids.map(id => (
                        <span key={`${movie.id}-${id}`} className="genre-item">
                            {genres.find(genre => genre.id === id).name}
                        </span>
                    ))}
                </h4>
            </div>

            <div className = "ratings" style={{ marginTop: ratingsPaddingTop }} ref={ratingsRef}>
                {/* <h5>{movie.vote_average}</h5> */}
                <div className="left-group">
                    <img 
                        className = "star-icon"
                        src="https://static.vecteezy.com/system/resources/previews/018/760/454/original/blue-star-icon-png.png" 
                        alt="star icon" 
                    />
                    <h5 className = "average-vote">{averageVote}</h5>
                    <h6 className = "scale">/10</h6>
                </div>

                <div className="cineberg-rating">
                    <img 
                        className = "cineberg-icon"
                        src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
                        alt="Cineberg-Icon" 
                    />
                    <h5 className = "cineberg-scale">Cineberg Scale: </h5>
                    <h5 className ="cineberg-iceberg"> {cinebergRating} </h5>
                </div>
            </div>

            {/* <div className = "cineberg-rating">
                <h5>{cinebergRating}</h5>
            </div> */}

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