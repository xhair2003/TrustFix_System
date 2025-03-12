// ForgotPassword.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetError } from '../../../store/actions/auth';
import VerifyOTP from './VerifyOTP';
import Swal from 'sweetalert2';
import Loading from '../../Loading/Loading';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();
  const { loading, errorForgotPassword, successForgotPassword } = useSelector((state) => state.auth);

  // Hiển thị thông báo khi có thay đổi về successMessage hoặc errorMessage
  useEffect(() => {
    if (successForgotPassword) {
      Swal.fire({
        title: "Thành công",
        text: successForgotPassword,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });
      setIsOtpSent(true); // Chuyển sang VerifyOTP sau khi gửi thành công
    }

    if (errorForgotPassword) {
      Swal.fire({
        title: "Lỗi",
        text: errorForgotPassword,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      setErrors(errorForgotPassword); // Cập nhật lỗi nếu có
    }
  }, [successForgotPassword, errorForgotPassword]);


  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors('Vui lòng nhập email hợp lệ');
      return;
    }

    dispatch(resetError()); // Đặt lại lỗi trước khi gọi 

    // Gọi action forgotPassword
    dispatch(forgotPassword(email));
  };

  return (
    <div className="login-container">
      {loading && <Loading />}
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
          {errors && <p style={{ color: 'red', textAlign: 'center' }}>{errors}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "GỬI MÃ XÁC THỰC..." : "GỬI MÃ XÁC THỰC"}
          </button>

          <p className="signup-link">
            <a href="/login">Quay lại đăng nhập</a>
          </p>
        </form>
      ) : (
        <VerifyOTP email={email} />
      )}
    </div>
  );
};

export default ForgotPasswordForm;