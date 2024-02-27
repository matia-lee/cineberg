import { useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import WatchedIcon from "./WatchedIcon";
import ThumbsUpIcon from "./ThumbsUpIcon";
import ThumbsDownIcon from "./ThumbsDownIcon";

const MovieCardFlipped = ({ movie, genres, onFlip, movieIds }) => {
  const [credits, setCredits] = useState([]);
  const [tagline, setTagline] = useState([]);
  const [overviewPaddingTop, setOverviewPaddingTop] = useState("0px");
  const [ratingsPaddingTop, setRatingsPaddingTop] = useState("0px");
  const [creditsPaddingTop, setCreditsPaddingTop] = useState("0px");
  const [genresPaddingTop, setGenresPaddingTop] = useState("0px");
  const [interactionsPaddingTop, setInteractionsPaddingTop] = useState("0px");
  const [watchedClick, setWatchedClick] = useState(false);
  const [thumbsUpClick, setThumbsUpClick] = useState(false);
  const [thumbsDownClick, setThumbsDownClick] = useState(false);
  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const ratingsRef = useRef(null);
  const taglineRef = useRef(null);
  const posterRef = useRef(null);
  const genreRef = useRef(null);
  const { username } = useAuth();

  const handleWatchedClick = async () => {
    console.log("Watched Click: Sending request", { username, movie_id: movie.id });
    const response = await fetch("http://localhost:5000/get_interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        movie_id: movie.id,
        interaction: "watched"
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Interaction recorded: ", data);
      setWatchedClick(prevState => !prevState)
    } else {
      console.error("Error recording interaction: ", data.error);
    }
  };

  const handleThumbsUpClick = async () => {
    const response = await fetch("http://localhost:5000/get_interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        movie_id: movie.id,
        interaction: "thumbs_up"
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Interaction recorded: ", data);
      setThumbsUpClick(prevState => !prevState)
    } else {
      console.error("Error recording interaction: ", data.error);
    }
  };

  const handleThumbsDownClick = async () => {
    const response = await fetch("http://localhost:5000/get_interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        movie_id: movie.id,
        interaction: "thumbs_down"
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Interaction recorded: ", data);
      setThumbsDownClick(prevState => !prevState)
    } else {
      console.error("Error recording interaction: ", data.error);
    }
  };

  useEffect(() => {
    const fetchInteractionState = async () => {
      const response = await fetch(`http://localhost:5000/get_interactions_state?username=${username}&movie_id=${movie.id}`, {
        method: "GET",
      });
  
      const data = await response.json();
      if (response.ok && data.interaction) {
        setWatchedClick(data.interaction.includes("watched"));
        setThumbsUpClick(data.interaction.includes("thumbs_up"));
        setThumbsDownClick(data.interaction.includes("thumbs_down"));
      } else {
        setWatchedClick(false);
        setThumbsUpClick(false);
        setThumbsDownClick(false);
      }
    };
  
    fetchInteractionState();
  }, [username, movie.id]);

  useEffect(() => {
    if (titleRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      setOverviewPaddingTop(`${titleHeight + 120}px`);
    }
  }, [movie]);

  useEffect(() => {
    if (titleRef.current && overviewRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      const overviewHeight = overviewRef.current.offsetHeight;
      setRatingsPaddingTop(`${titleHeight + overviewHeight + 175}px`);
    }
  }, [movie]);

  useEffect(() => {
    if (titleRef.current && overviewRef.current && ratingsRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      const overviewHeight = overviewRef.current.offsetHeight;
      const ratingsHeight = ratingsRef.current.offsetHeight;
      setCreditsPaddingTop(
        `${titleHeight + overviewHeight + ratingsHeight + 180}px`
      );
    }
  }, [movie]);

  useEffect(() => {
    const updatePaddingTop = () => {
      if (taglineRef.current && posterRef.current) {
        const taglineHeight = taglineRef.current.offsetHeight;
        const posterHeight = posterRef.current.offsetHeight;
        setGenresPaddingTop(`${taglineHeight + posterHeight + 123}px`);
      } else {
        setGenresPaddingTop("90px");
      }
    };

    updatePaddingTop();

    const taglineObserver = new MutationObserver(updatePaddingTop);
    if (taglineRef.current) {
      taglineObserver.observe(taglineRef.current, {
        childList: true,
        subtree: true,
      });
    }
  }, [movie]);

  useEffect(() => {
    const updateInteractionsPaddingTop = () => {
      if (posterRef.current && overviewRef.current && genreRef.current) {
        const taglineHeight = taglineRef.current.offsetHeight;
        const posterHeight = posterRef.current.offsetHeight;
        const genreHeight = genreRef.current.offsetHeight;
        setInteractionsPaddingTop(`${taglineHeight + posterHeight + genreHeight + 113}px`);
      } else {
        setInteractionsPaddingTop("70px");
      }
    };

    updateInteractionsPaddingTop();

    const taglineObserver = new MutationObserver(updateInteractionsPaddingTop);
    if (taglineRef.current) {
      taglineObserver.observe(taglineRef.current, {
        childList: true,
        subtree: true,
      });
    }
  }, [movie]);

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + api_key,
      },
    };

    fetch(
      "https://api.themoviedb.org/3/movie/" +
        movie.id +
        "/credits?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setCredits(data.cast.slice(0, 5));
      })
      .catch((err) => console.error(err));

    fetch(
      "https://api.themoviedb.org/3/movie/" + movie.id + "?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setTagline(data.tagline);
      })
      .catch((err) => console.error(err));
  }, [movie.id]);

  let cinebergRating;
  const popularity = movie.popularity;
  if (popularity >= 0 && popularity < 6.9) {
    cinebergRating = "Underground";
  } else if (popularity >= 6.9 && popularity < 31) {
    cinebergRating = "Niche";
  } else if (popularity >= 31 && popularity < 100000) {
    cinebergRating = "Tip of the Iceberg";
  }

  const averageVote = Math.round(parseFloat(movie.vote_average) * 10) / 10;

  return (
    <div className="container">
      <div className="title-runtime">
        <div className="title" ref={titleRef}>
          <h2>{movie.title}</h2>
        </div>
      </div>

      <div className="tagline" ref={taglineRef}>
        <h3>{tagline}</h3>
      </div>

      <div className="overview" style={{ marginTop: overviewPaddingTop }}>
        <h3>Overview:</h3>
        <p ref={overviewRef}>{movie.overview}</p>
      </div>

      <div className="backdrop">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt="movie backdrop"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="flipped-poster" ref={posterRef}>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="genre" style={{ marginTop: genresPaddingTop }} ref={genreRef}>
        <h4>
          {movie.genres
            ? movie.genres.map((genre) => (
                <span key={`${movie.id}-${genre.id}`} className="genre-item">
                  {genre.name}
                </span>
              ))
            : movie.genre_ids.map((id) => (
                <span key={`${movie.id}-${id}`} className="genre-item">
                  {genres.find((genre) => genre.id === id).name}
                </span>
              ))}
        </h4>
      </div>

      <div
        className="ratings"
        style={{ marginTop: ratingsPaddingTop }}
        ref={ratingsRef}
      >
        <div className="left-group">
          <img
            className="star-icon"
            src="https://static.vecteezy.com/system/resources/previews/018/760/454/original/blue-star-icon-png.png"
            alt="star icon"
          />
          <h5 className="average-vote">{averageVote}</h5>
          <h6 className="scale">/10</h6>
        </div>

        <div className="cineberg-rating">
          <img
            className="cineberg-icon"
            src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png"
            alt="Cineberg-Icon"
          />
          <h5 className="cineberg-scale">Cineberg Scale: </h5>
          <h5 className="cineberg-iceberg"> {cinebergRating} </h5>
        </div>
      </div>

      <div
        className="credits-container"
        style={{ marginTop: creditsPaddingTop }}
      >
        {credits.map((person) => (
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

      <div className="interactions" style={{ marginTop: interactionsPaddingTop }}>
        <WatchedIcon
          className={watchedClick ? "toggled-watched-icon" : "watched-icon"}
          onClick={handleWatchedClick}
        />
        <ThumbsUpIcon 
          className={thumbsUpClick ? "toggled-thumbs-up-icon" : "thumbs-up-icon"}
          onClick={handleThumbsUpClick}
        />
        <ThumbsDownIcon 
          className={thumbsDownClick ? "toggled-thumbs-down-icon" : "thumbs-down-icon"}
          onClick={handleThumbsDownClick}
        />
      </div>
    </div>
  );
};

export default MovieCardFlipped;
