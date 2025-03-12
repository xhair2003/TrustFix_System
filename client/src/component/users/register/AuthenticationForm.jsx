import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyRegister, registerUser, resetError } from "../../../store/actions/auth";
import Swal from "sweetalert2";
import "./RegisterForm.scss";

const AuthenticationForm = ({ email, userData }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading, errorVerifyRegister } = useSelector((state) => state.auth);

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Tự động focus vào ô đầu tiên
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown); // Dọn dẹp interval khi component unmount
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
    const fullCode = code.join("");

    if (fullCode.length !== 6 || isNaN(fullCode)) {
      setError("Vui lòng nhập mã OTP 6 số hợp lệ");
      return;
    }

    dispatch(resetError()); // Đặt lại lỗi trước khi gọi 

    try {
      await dispatch(verifyRegister(email, fullCode));
      setError("");

      if (errorVerifyRegister) {
        Swal.fire({
          title: "Error",
          text: errorVerifyRegister || "Registration failed. Please try again.",
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
      }
      else {
        Swal.fire({
          title: "Success",
          text: "Đăng ký thành công !",
          icon: "success",
          timer: 5000,
          showConfirmButton: false,
        });

        window.location.href('/login');
      }

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.EM || "Registration failed. Please try again.",
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
    }
  };

  const handleResend = async () => {
    dispatch(resetError()); // Đặt lại lỗi trước khi gọi 

    if (canResend && !loading) {
      try {
        await dispatch(registerUser(userData)); // Sử dụng userData từ props
        setTimer(60); // Reset timer
        setCanResend(false); // Không cho phép gửi lại mã ngay lập tức
        setCode(["", "", "", "", "", ""]); // Reset mã OTP
        inputRefs.current[0].focus(); // Focus vào ô đầu tiên
        setError(""); // Reset lỗi
      } catch (err) {
        setError("Gửi lại mã thất bại. Vui lòng thử lại.");
      }
    }
  };

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
              disabled={loading}
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button" disabled={loading}>
          {loading || loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
        </button>

        <p className="signin-link">
          Chưa nhận được mã?{" "}
          <a
            href="#"
            onClick={handleResend}
            style={{
              color: canResend && !loading ? "#1a73e8" : "#666",
              pointerEvents: loading ? "none" : "auto",
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