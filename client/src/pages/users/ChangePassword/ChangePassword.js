import { useState } from "react";
import React from "react";
import "./ChangePassword.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [personalInfo] = useState({
    email: "nguyen@example.com",
    phone: "0987654321",
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [authMethod, setAuthMethod] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Logic xử lý đổi mật khẩu
      console.log("Form submitted:", {
        ...form,
        authMethod,
      });
      
      // Ví dụ: Gửi request API ở đây
      // api.changePassword(form)
      //   .then(response => {
      //     // Xử lý thành công
      //   })
      //   .catch(error => {
      //     // Xử lý lỗi
      //   });
    }
  };

  return (
    <div className="history-container">
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
          <button type="submit" className="change-pass-button">
            Đổi Mật Khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;