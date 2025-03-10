import React, { useState, useEffect, useRef } from "react";
import "./RegisterForm.scss";

const AuthenticationForm = ({ email, onSuccess }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Tự động focus vào ô đầu tiên
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setCode(pastedData.split(""));
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fullCode = code.join("");

    if (fullCode.length !== 6 || isNaN(fullCode)) {
      setError("Vui lòng nhập mã OTP 6 số hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      // Giả lập API xác thực
      const response = await fakeVerifyApi(fullCode);
      setError("");
      onSuccess();
    } catch (err) {
      setError("Mã OTP không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (canResend && !isLoading) {
      setIsLoading(true);
      try {
        await fakeResendApi(email);
        setTimer(60);
        setCanResend(false);
        setCode(["", "", "", "", "", ""]);

        inputRefs.current[0].focus();
        setError("");
      } catch (err) {
        setError("Gửi lại mã thất bại. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Giả lập API
  const fakeVerifyApi = (code) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 1000)
    );
  const fakeResendApi = (email) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 1000)
    );

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <p className="welcome-text">XÁC THỰC OTP</p>
        <p className="register-title2">
          Nhập mã xác thực đã gửi đến {email}
        </p>

        <div className="form-group otp-group" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="otp-input"
              required
              disabled={isLoading}
            />
          ))}
          
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button" disabled={isLoading}>
          {isLoading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
        </button>

        <p className="signin-link">
          Chưa nhận được mã?{" "}
          <a
            href="#"
            onClick={handleResend}
            style={{
              color: canResend && !isLoading ? "#1a73e8" : "#666",
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            Gửi lại {timer > 0 && `(${timer}s)`}
          </a>
        </p>
      </form>
    </div>
  );
};

export default AuthenticationForm;