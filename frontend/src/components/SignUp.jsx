import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    const passwordIsValid = signUpPassword.length >= 6;
    setValidPassword(passwordIsValid);
    const emailIsValid = signUpEmail.length > 0;
    setValidEmail(emailIsValid);

    if (!passwordIsValid || !emailIsValid) {
      return;
    } 

    try {
      const user = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      navigate("/");
      console.log(user);
    } catch (error) {
      console.log("Registration error: ", error.message)
    }
  };

  const clickViewPassword = () => {
    setViewPassword(!viewPassword)
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
          className={`email ${!validEmail ? "password-invalid" : ""}`}
          type="email" 
          placeholder='Email Address' 
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        {!validEmail && validPassword && <div className="error-message"><h6>Invalid Email</h6></div>}
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
      </div>

      <div className="complete-signup" onClick={signup}>
        <h3>Sign Up</h3>
      </div>
    </div>
  );
};

export default SignUp;
