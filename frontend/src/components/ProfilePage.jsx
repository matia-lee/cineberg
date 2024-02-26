import { useAuth } from "./AuthContext";

const ProfilePage = () => {

  const { username } = useAuth();

  return (
    <div className="hello">
      <h1>hello {username}</h1>
      <h3>john doe</h3>
    </div>
  );
};

export default ProfilePage;
