import { useAuth } from "./AuthContext";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { username, signOut } = useAuth();

  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/');
  };

  const handleLogoutClick = () => {
    signOut();
    navigate('/');
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
          <li>Watched Movies</li>
          <li>Liked Movies</li>
          <li>Disliked Movies</li>
        </ul>
      </div>

      <div className="profile-frame">

      </div>
    </div>
  );
};

export default ProfilePage;
