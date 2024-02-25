import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const LoginPage = () => {

  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { signIn } = useAuth();

  const handleAuth = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      console.log(user);
    }).catch((error) => {
      if (error.code === "auth/cancelled-popup-request") {
        console.log('Sign-in popup was closed before completion.');
      } else {
        console.log('Error: ', error);
      }
    });
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("Login data: ", loginEmail, loginPassword);

      await signIn(loginEmail, loginPassword); 
      navigate("/");
    } catch (error) {
      console.log("Login error: ", error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
          alt="Cineberg-Icon" 
        />

        <h1>Cineberg</h1>
      </div>

      <div className="google-login" onClick={handleAuth}>
        <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="google logo" />
        <h3>Continue with Google</h3>
      </div>

      <div className='divider'>
        <p>or</p>
      </div>

      <div className='email-login'>
        <input 
          className="email" 
          type="email" 
          placeholder='Email Address' 
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input 
          className="password" 
          type="password" 
          placeholder='Password' 
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>
          LOGIN
        </button>
      </div>

      <div className='create-account'>
        <p>Don't have an account? </p>
        <span className="sign-in-link" onClick={handleSignUpClick}>Create Account</span>
      </div>
    </div>
  );
};

export default LoginPage;