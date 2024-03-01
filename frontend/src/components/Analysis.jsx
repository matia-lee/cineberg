import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AnalysisMovieCard from './AnalysisMovieCard';
import MovieCardFlipped from './MovieCardFlipped';

const Analysis = () => {
  const { userEmail } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisMovie, setAnalysisMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profilepage');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchMovie();
      handleSearchClick();
    }
  };

  const handleFlip = (movie) => {
    setFlipped(prevFlippedMovie => (prevFlippedMovie === movie ? null : movie))
    if (movie) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
  };

  const fetchMovie = () => {
    if (!searchTerm) return;
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: "Bearer " + api_key,
      }
    };

    fetch('https://api.themoviedb.org/3/search/movie?query=' + searchTerm + '&include_adult=false&language=en-US&page=1', options)
      .then(response => response.json())
      .then(response => {
        if (response.results && response.results.length > 0) {
          setAnalysisMovie(response.results[0]);
        } else {
          console.log('No results found');
          setAnalysisMovie(null);
        }
      })
      .catch(err => {
        console.error(err);
        setAnalysisMovie(null);
      });
  }

  const handleSearchClick = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/movie_analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });
      if (response.ok) {
        const analysis = await response.json();
        setAnalysis(analysis);
      } else {
        console.error("Failed to fetch analysis");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const initiateSearch = () => {
    fetchMovie();
    handleSearchClick();
  };

  useEffect(() => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + api_key,
      },
    };

    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className = "main-text">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
          alt="Cineberg-Icon" 
          onClick={handleIconClick}
        />

        <h1 onClick={handleIconClick}>
          Cineberg
        </h1>

        <h3>AI Powered Analyses</h3>

        {userEmail !== null ? (
          <div className='loggedin'>
            <img 
              src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" 
              alt="logged in icon" 
              onClick={handleProfileClick}
            />
          </div>
        ) : (
          <div className='login' onClick={handleLoginClick}>
            <h1>LOGIN</h1>
          </div>
        )}
      </div> 

      <div className="analyse-search-button" onKeyDown={handleKeyDown}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie to analyse"
        />

        <img
          src="https://static.vecteezy.com/system/resources/previews/009/973/089/non_2x/magnifying-glass-sign-search-icon-free-png.png"
          alt="search"
          onClick={initiateSearch}
        />
      </div>

      {analysisMovie && (
        <div className='analysis-movie-card'>
          <div 
            key = {analysisMovie.id} 
            onClick={() => {
              handleFlip(analysisMovie);
            }}>

            {loading && <div className="loading-text">Analysing</div>}

            <AnalysisMovieCard movie={analysisMovie}/>
          </div>

          <div className="analysis-paragraph">
            {analysis}
          </div>
        </div>
      )}

      {flipped && (
        <>
          <div onClick={() => handleFlip(null)} className = "overlay"></div>
            <div className = "container-flipped">
              <MovieCardFlipped 
                  key = {analysisMovie.id} 
                  movie={flipped}
                  genres={genres}
                  onFlip={handleFlip}
              />
            </div>
        </>
      )}
    </div>
  );
};

export default Analysis;
