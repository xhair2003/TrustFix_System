import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../store/actions/auth"; // Import action
import Swal from "sweetalert2";
import "./ChangePassword.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Loading from "../../../component/Loading/Loading";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, errorChangePassword, successChangePassword } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Hàm validate form
  const validateForm = () => {
    let tempErrors = {};

    if (!form.currentPassword) {
      tempErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!form.newPassword) {
      tempErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (form.newPassword.length < 8) {
      tempErrors.newPassword = "Mật khẩu mới phải dài ít nhất 8 ký tự";
    }

    if (!form.confirmPassword) {
      tempErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (form.confirmPassword !== form.newPassword) {
      tempErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const { currentPassword, newPassword, confirmPassword } = form;
      dispatch(changePassword(currentPassword, newPassword, confirmPassword)); // Gọi action changePassword
    }
  };

  // Hiển thị thông báo khi có thay đổi về successMessage hoặc errorMessage
  useEffect(() => {
    if (successChangePassword) {
      Swal.fire({
        title: "Thành công",
        text: successChangePassword,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });

      // Reset dữ liệu các ô thành rỗng
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({}); // Reset lỗi
    }

    if (errorChangePassword) {
      Swal.fire({
        title: "Lỗi",
        text: errorChangePassword,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
    }
  }, [successChangePassword, errorChangePassword]);

  return (
    <div className="history-container">
      {loading && <Loading />}
      <div className="history-form">
        <h2 className="complaint-title">THAY ĐỔI MẬT KHẨU</h2>
        <form className="changePass-container" onSubmit={handleSubmit}>
          {/* Mật khẩu hiện tại */}
          <div className="input-group">
            <label>Mật khẩu hiện tại</label>
            <div className="password-input">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                className={errors.currentPassword ? "error-input" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="toggle-password"
              >
                {showPassword.current ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>

          {/* Mật khẩu mới */}
          <div className="input-group">
            <label>Mật khẩu mới</label>
            <div className="password-input">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                className={errors.newPassword ? "error-input" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="toggle-password"
              >
                {showPassword.new ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="input-group">
            <label>Xác nhận mật khẩu mới</label>
            <div className="password-input">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                className={errors.confirmPassword ? "error-input" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="toggle-password"
              >
                {showPassword.confirm ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          {/* Nút đổi mật khẩu */}
          <button type="submit" className="change-pass-button" disabled={loading}>
            {loading ? "ĐANG THAY ĐỔI..." : "ĐỔI MẬT KHẨU"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;