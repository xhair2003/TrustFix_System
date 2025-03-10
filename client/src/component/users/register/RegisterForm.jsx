import React, { useState } from "react";
import "./RegisterForm.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

  const validatePassword = (pwd) => {
    // Yêu cầu mật khẩu: ít nhất 8 ký tự, có chữ cái in hoa, số và ký tự đặc biệt
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Giả lập API call
      const response = await fakeRegisterApi({ name, email, password });
      setError("");
      onRegisterSuccess(email);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Giả lập API
  const fakeRegisterApi = (data) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 1000)
    );

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="label-text">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
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
              type={showRePassword ? "text" : "password"}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              disabled={isLoading}
            />
            <span
              className="password-toggle"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <button
          type="submit"
          className="signup-button"
          disabled={isLoading}
        >
          {isLoading ? "SIGNING UP..." : "SIGN UP"}
        </button>

        <p className="signin-link">
          You have account? <a href="/login">SIGN IN HERE</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;