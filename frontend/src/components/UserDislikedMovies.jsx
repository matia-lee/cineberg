import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';

const UserDislikedMovies = () => {
  const { username, signOut } = useAuth();

  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/');
  };

  const handleLogoutClick = () => {
    signOut();
    navigate('/');
  };

  const handleWatchedClick = () => {
    navigate('/profilepage');
  };

  const handleLikedClick = () => {
    navigate('/profilelikedmovies');
  };

  const handleDislikedClick = () => {
    navigate('/profiledislikedmovies');
  };

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
      </div> 

      <div className='logout' onClick={handleLogoutClick}>
        <h1>LOGOUT</h1>
      </div>

      <div className="menu">
        <h1>
          Welcome <span className="username">{username}</span>!
        </h1>
        <ul style={{ listStyleType: 'none' }}>
          <li onClick={handleWatchedClick}>Watched Movies</li>
          <li onClick={handleLikedClick}>Liked Movies</li>
          <li onClick={handleDislikedClick}>Disliked Movies</li>
        </ul>
      </div>

      <div className="profile-frame">
        <div className="subtitle">
            <h2>Disliked Movies: </h2>
          </div>

          <div className="container-movie">
            {/* {trendingMovies.map((movie) => (
                <div key = {movie.id} onClick={() => handleFlip(movie)}>
                  <MovieCard movie={movie}/>
                </div>
              ))} */}
          </div>
      </div>
    </div>
  );
};

export default UserDislikedMovies;
