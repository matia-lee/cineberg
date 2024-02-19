import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      navigate("/");
      console.log(user);
    } catch (error) {
      console.log("Registration error: ", error.message)
    }
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

      <div className='email-login'>
        <input className="email" type="text" placeholder='Email Address' onChange={(e) => setSignUpEmail(e.target.value)}/>
        <input className="password" type="text" placeholder='Create Password' onChange={(e) => setSignUpPassword(e.target.value)}/>
      </div>

      <div className="complete-signup" onClick={signup}>
        <h3>Sign Up</h3>
      </div>
    </div>
  );
};

export default SignUp;
