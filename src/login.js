import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  // State to track the selected form
  const [isLogin, setIsLogin] = useState(true);
  const [secondStep, setStep] = useState(false); //0 for first step, 1 for the second step
  const [thereisError, setError2] = useState(false);

  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmitLog = async(event) => {
    event.preventDefault();

    console.log({email, password});

    const payload = { email, password };

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
      });
    
      if (!response.ok) {
        if(response.status == 400) setError("Email and password are required.");
        throw new Error('Failed to log in');
      }
    
      const result = await response.json();
      console.log(result); // Handle successful login

      navigate('/questions');

    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmitReg = async(event) => {
    event.preventDefault();

    if(!isLogin && password != confirmPassword) {
      setError2(true);
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      setError2(true);
      setError('Please enter a valid email address.');
      return;
    }

    if(password.length < 8) {
      setError2(true);
      setError('Password length is too short!');
      return;
    }

    console.log("Form Data:", { email, dni, firstname, lastname, age, sex, password });
    
    const payload = { email, password, firstname, lastname, dni, age, sex, confirmPassword };

  // Send data to the backend using fetch
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send form data as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      console.log(result); // Handle the success response here

      // Handle success (e.g., redirect user, show success message)
    } catch (error) {
      console.error(error);
      setError('An error occurred while submitting the form');
    }
  }

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
          <form onSubmit={handleSubmitLog}>
            <input type="text" id="email" className="email-cl" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" id="pwd" className="pwd-cl" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='login-bt-active'>Login</button>
          </form>
        ) : (
          <form onSubmit={handleSubmitReg}>
            <input type="text" id="firstname" className='first-cl' placeholder='First Name' value={firstname} onChange={(e) => setFirstName(e.target.value)}/>
            <input type="text" id="lastname" className='last-cl' placeholder='Last Name' value={lastname} onChange={(e) => setLastName(e.target.value)}/>
            <input type="text" id="identifier" className='id-cl' placeholder='National Document Number' value={dni} onChange={(e) => setDni(e.target.value)}/>
            <input type="text" id="email" className="email-cl" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" id="pwd" className="pwd-cl" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" id="confirm-pwd" className="pwd-cl" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <input type="number" id="age" className='age-cl' placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)}/>
            <select type="text" id="sex" className='sex-cl' placeholder="Sex (M/F)" value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            <button className={`register-bt ${!isLogin ? 'active' : ''}`}>Register</button>
          </form>
          
        )}
        {error && <p style={{ color: 'red' }}>{thereisError ? error : ''}</p>}
      </div>
    </div>
  );
}

export default Login;