import { useState } from "react";

const SignUp = () => {

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const signup = () => {

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
        <input className="email" type="text" placeholder='Email Address' />
        <input className="password" type="text" placeholder='Create Password'/>
      </div>

      <div className="complete-signup">
        <h3>Sign Up</h3>
      </div>
    </div>
  );
};

export default SignUp;
