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
  };

  // Hàm kiểm tra tính hợp lệ của mật khẩu
  const validatePasswords = () => {
    let errors = {};
    if (!form.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (form.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu không khớp";
    }
    if (!otpSent) {
      errors.otp = "Vui lòng nhập mã OTP đã gửi";
    } else if (form.otp !== generatedOtp) {
      errors.otp = "Mã OTP không chính xác";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Hàm xử lý khi nhấn nút đổi mật khẩu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePasswords()) {
      alert("Mật khẩu đã được thay đổi thành công!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setOtpSent(false);
      setGeneratedOtp("");
    }
  };

  // Hàm gửi mã OTP có thời gian chờ 60s
  const sendOtp = () => {
    if (otpCooldown > 0) return;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setOtpSent(true);
    alert(`Mã OTP của bạn là: ${otpCode}`); // Thực tế nên gửi qua email/SMS

    setOtpCooldown(60);
    const countdown = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

          {/* Chọn phương thức xác thực */}
          <div className="input-group">
            <label>Xác thực bằng</label>
            <div className="auth-method">
              <label>
                <input
                  type="radio"
                  name="authMethod"
                  value="email"
                  checked={authMethod === "email"}
                  onChange={() => setAuthMethod("email")}
                  className="textotp"
                />
                Email ({personalInfo.email})
              </label>
              <label>
                <input
                  type="radio"
                  name="authMethod"
                  value="phone"
                  checked={authMethod === "phone"}
                  onChange={() => setAuthMethod("phone")}
                  className="textotp"
                />
                Số điện thoại ({personalInfo.phone})
              </label>
            </div>
            <button
              type="button"
              className="send-otp-button"
              onClick={sendOtp}
              disabled={otpCooldown > 0}
            >
              {otpCooldown > 0 ? `Gửi lại sau ${otpCooldown}s` : "Gửi mã xác nhận"}
            </button>
          </div>

          {/* Nhập mã OTP */}
          {otpSent && (
            <div className="input-group">
              <label>Nhập mã OTP</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Nhập mã OTP"
                className={errors.otp ? "error-input" : ""}
              />
              {errors.otp && <p className="error-text">{errors.otp}</p>}
            </div>
          )}

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
