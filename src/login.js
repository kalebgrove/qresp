import React, { useState } from 'react';
import './login.css';

function Login() {
  // State to track the selected form
  const [isLogin, setIsLogin] = useState(true);
  
  const FormData = useState(
    user_email = '',
    password = '',
    repeat_password = ''
  );

  return (
    <div>
      {/* Button container with flexbox */}
      <div className="button-container">
        <button 
          className={`login-header ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)} // Set to Login form
        >
          Login
        </button>
        <button 
          className={`register-header ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)} // Set to Register form
        >
          Register
        </button>
      </div>

      {/* Conditionally render the Login or Register form */}
      <div className="login">
        {isLogin ? (
          <form>
            <input type="text" id="email" className="email-cl" placeholder="Email" />
            <input type="password" id="pwd" className="pwd-cl" placeholder="Password" />
            <button className='login-bt-active'>Login</button>
          </form>
        ) : (
          <form>
            <input type="text" id="firstname" className='first-cl' placeholder='First Name'/>
            <input type="text" id="lastname" className='last-cl' placeholder='Last Name'/>
            <input type="text" id="identifier" className='id-cl' placeholder='National Document Number'/>
            <input type="text" id="email" className="email-cl" placeholder="Email" />
            <input type="password" id="pwd" className="pwd-cl" placeholder="Password" />
            <input type="password" id="confirm-pwd" className="pwd-cl" placeholder="Confirm Password" />
            <input type="number" id="age" className='age-cl' placeholder="Age"/>
            <input type="text" id="sex" className='sex-cl' placeholder="Sex (M/F)"/>
            <button className={`register-bt ${!isLogin ? 'active' : ''}`}>Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;