// LoginForm.js
import React, { useState, useEffect } from 'react';
import './LoginForm.scss';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { login, resetError, resetSuccess } from '../../../store/actions/authActions';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, errorLogin, successLogin, role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  // console.log(errorLogin);
  // console.log(successLogin);

  useEffect(() => {
    if (errorLogin) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: errorLogin,
        timer: 5000,
        timerProgressBar: true,
        showCloseButton: true,
        showConfirmButton: false,
      });
      dispatch(resetError());
    }

    if (successLogin && role) {
      if (role === 'admin') {
        dispatch(resetSuccess());
        navigate('/admin/dashboard');
      } else {
        dispatch(resetSuccess());
        navigate('/');
      }
    }
  }, [errorLogin, successLogin, role, dispatch, navigate]);

  // Render logic
  if (successLogin && !role) {
    return <Loading />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetError());
    dispatch(login(email, password));
  };

  return (
    <div className="login-container">
      {loading && <Loading />}
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

        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" />
            Ghi nhớ mật khẩu
          </label>
          <a href="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </a>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
        </button>

        <p className="signup-link">
          Bạn là người mới? <a href="/register">ĐĂNG KÝ</a>
        </p>

        <p className="home-link">
          <Link to="/">Quay về trang chủ</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;