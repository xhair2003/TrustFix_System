// ForgotPassword.js
import React, { useState } from 'react';
import ResetPasswordForm from '../../pages/users/ResetPassword';
import AuthenticationForm from '../users/register/AuthenticationForm'; // Import ResetPasswordForm

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Trạng thái xác thực OTP
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      // Giả lập API gửi OTP
      console.log('Sending OTP to:', email);
      // const response = await api.sendOtp(email); // Thay bằng API thực tế
      
      setIsOtpSent(true); // Mở AuthenticationForm
      setCooldown(60);
      
      // Đếm ngược cooldown
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Không thể gửi OTP, vui lòng thử lại');
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVerified(true); // Khi OTP xác thực thành công, chuyển sang ResetPasswordForm
    console.log('OTP verified successfully for:', email);
  };

  return (
    <div className="login-container">
      {!isOtpSent ? (
        <form className="login-form" onSubmit={handleSendOtp}>
          <p className="welcome-back">KHÔI PHỤC MẬT KHẨU</p>
          <p className="login-title">Quên mật khẩu của bạn?</p>

          <div className="form-group">
            <label className="login-title2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            className="login-button"
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `GỬI LẠI (${cooldown}s)` : "GỬI MÃ XÁC THỰC"}
          </button>

          <p className="signup-link">
            <a href="/login">Quay lại đăng nhập</a>
          </p>
        </form>
      ) : !isOtpVerified ? (
        <AuthenticationForm email={email} onSuccess={handleOtpSuccess} />
      ) : (
        <ResetPasswordForm email={email} />
      )}
    </div>
  );
};

export default ForgotPasswordForm;