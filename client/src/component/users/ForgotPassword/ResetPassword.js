import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../store/actions/auth';
import Loading from '../../Loading/Loading';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');
  const dispatch = useDispatch();
  const { loading, successResetPassword, errorResetPassword, resetToken } = useSelector((state) => state.auth);
  //console.log(resetToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(resetPassword(resetToken, newPassword, confirmPassword));
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrors(err);
    }
  };

  // Hiển thị thông báo khi có thay đổi về successMessage hoặc errorMessage
  useEffect(() => {
    if (successResetPassword) {
      Swal.fire({
        title: "Thành công",
        text: successResetPassword,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });
      navigate('/login');
    }

    if (errorResetPassword) {
      Swal.fire({
        title: "Lỗi",
        text: errorResetPassword,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      setErrors(errorResetPassword); // Cập nhật lỗi nếu có
    }
  }, [successResetPassword, errorResetPassword, navigate]);

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });


  // Hàm kiểm tra form
  const validateForm = () => {
    let tempErrors = {};

    if (!newPassword) {
      tempErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = "Mật khẩu phải dài ít nhất 8 ký tự";
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="login-container">
      {loading && <Loading />}
      <form className="login-form" onSubmit={handleSubmit}>
        <p className="welcome-back">ĐẶT LẠI MẬT KHẨU</p>
        <p className="login-title">Tạo mật khẩu mới cho tài khoản của bạn</p>

        <div className="form-group">
          <label className="login-title2">Mật khẩu mới</label>
          <div className="password-container">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
              required
              className={errors.newPassword ? 'error-input' : ''}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.newPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.newPassword}</p>}
        </div>

        <div className="form-group">
          <label className="login-title2">Xác nhận mật khẩu</label>
          <div className="password-container">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
              className={errors.confirmPassword ? 'error-input' : ''}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
        </button>

        <p className="signup-link">
          <a href="/login">Quay lại đăng nhập</a>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordForm;




