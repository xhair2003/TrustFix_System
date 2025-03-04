// LoginForm.js
import React, { useState } from 'react';
import './LoginForm.scss';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const LoginForm = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <p className='welcome-back'>Chào mừng quay trở lại</p>
        <p className='login-title'>Đăng nhập bằng tài khoản của bạn</p>

        <div className="form-group">
          <label className='login-title2'>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label className='login-title2'>Mật khẩu</label>
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

        <div className="options">
          <label className="remember-me">
            <input type="checkbox" />
            Ghi nhớ mật khẩu
          </label>
          <a href="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </a>
        </div>

        <button type="submit" className="login-button">
          ĐĂNG NHẬP
        </button>

        <p className="signup-link">
          Bạn là người mới? <a href="/register">ĐĂNG KÝ</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;