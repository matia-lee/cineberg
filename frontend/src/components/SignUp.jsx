import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "./AuthContext"; 
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [sameValidUsername, setSameValidUsername] = useState(true);
  const [sameValidEmail, setSameValidEmail] = useState(true);
  const [sameEmailError, setSameEmailError] = useState("");
  const [sameUsernameError, setSameUsernameError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    setSameValidEmail(sameValidUsername);
  }, [sameValidUsername]);

  const signup = async () => {
    const passwordIsValid = signUpPassword.length >= 6;
    setValidPassword(passwordIsValid);
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail);
    setValidEmail(emailIsValid);

    setSameValidEmail(sameValidEmail);
    setSameValidUsername(sameValidUsername);

    if (!passwordIsValid || !emailIsValid) {
      return;
    } 

    try {
      const unique = await validateUniqueness(signUpEmail, signUpUsername);
      if (!unique.ok) {
        const dataError = await unique.json();
        if (dataError.message.includes("Email")) {
          setSameEmailError(dataError.message);
          setSameValidEmail(!sameValidEmail);
        } else if (dataError.message.includes("Username")) {
          setSameUsernameError(dataError.message);
          setSameValidUsername(!sameValidUsername);
        }
        return;
      }
    } catch (error) {
      console.log("Error validating uniqueness", error);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      console.log("Signup data: ", signUpEmail, signUpPassword, signUpUsername);

      await signIn(signUpEmail, signUpPassword);
      navigate("/");
    } catch (error) {
      console.log("Signup error: ", error.message);
    }
  };

  const clickViewPassword = () => {
    setViewPassword(!viewPassword)
  };

  const validateUniqueness = async (email, username) => {
    return fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, username }),
    });
  };

  return (
    <div className="create-account-container">
      <div className="logo">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1997/1997412.png" 
          alt="Cineberg-Icon" 
        />

        <h1>Cineberg</h1>

        <h3 className="create-account-title">Create Account</h3>
      </div>

      <div className='email-signup'>
        <input 
          className={`username ${!sameValidUsername ? "password-invalid" : ""}`}
          type="text" 
          placeholder="Create Username"
          onChange={(e) => setSignUpUsername(e.target.value)}
        />
        <input 
          className={`email ${!validEmail || !sameValidEmail ? "password-invalid" : ""}`}
          type="email" 
          placeholder='Email Address' 
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        {!validEmail && validPassword && <div className="error-message"><h6>Invalid Email</h6></div>}
        {!sameValidEmail && sameValidUsername && <div className="error-message"><h6>{sameEmailError}</h6></div>}
        <div className="signup-password">
          <input 
            className={`password ${!validPassword ? "password-invalid" : ""}`} 
            type={viewPassword ? "text" : "password"}
            placeholder='Create Password' 
            onChange={(e) => setSignUpPassword(e.target.value)}
          />
          <img
            className={`view-icon ${!validPassword ? "invalid-view-icon" : ""}`}
            src={viewPassword ? "https://static.thenounproject.com/png/5028199-200.png" : "https://static.thenounproject.com/png/777494-200.png"}
            alt="view password" 
            onClick={clickViewPassword}
          />
        </div>

        {!validPassword && validEmail && <div className="error-message"><h6>Password must be at least 6 characters</h6></div>}

        {!validEmail && !validPassword && (
        <div className="error-message-combined">
          <p>Both email and password are invalid</p>
          <p>Password must be at least 6 characters</p>
        </div>
        )}
        {!sameValidUsername && !sameValidEmail && (
        <div className="error-message-combined">
          <p>Username taken</p>
          <p>Email already in use</p>
        </div>
        )}
        {sameValidEmail && !sameValidUsername && <div className="error-message"><h6>{sameUsernameError}</h6></div>} 
      </div>

      <div className="complete-signup" onClick={signup}>
        <h3>Sign Up</h3>
      </div>
    </div>
  );
};

export default SignUp;