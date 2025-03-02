import React, { useState } from 'react';
import './RegisterForm.scss';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState(''); // State for error message

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== rePassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    // Clear error if passwords match and proceed with registration logic
    setError('');
    console.log('Registration attempted with:', { name, email, password, rePassword });
    // Add your registration logic here (e.g., API call)
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <p className="welcome-text">LET'S GET YOU STARTED</p>
        <h2 className="register-title">Create new Account</h2>

        <div className="form-group">
          <label className="label-text">Enter your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label className="label-text">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label className="label-text">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="label-text">Re-Password</label>
          <div className="password-container">
            <input
              type={showRePassword ? 'text' : 'password'}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </div>

        <button type="submit" className="signup-button">
          SIGN UP
        </button>

        <p className="signin-link">
          You have account? <a href="/login">SIGN IN HERE</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;