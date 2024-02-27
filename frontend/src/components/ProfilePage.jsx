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

      <div className="menu">
        Hi, {username}!
      </div>

      <button onClick={handleLogoutClick}>logout</button>
    </div>
  );
};

export default ProfilePage;
