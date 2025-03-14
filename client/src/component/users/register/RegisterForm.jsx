import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetError } from "../../../store/actions/authActions";
import Swal from "sweetalert2";
import "./RegisterForm.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../../Loading/Loading";

const RegisterForm = ({ onRegisterSuccess }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState(null);
  const { loading, errorRegister, successRegister } = useSelector((state) => state.auth);

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi kiểm tra

    let validationErrors = {};
    if (!firstName.trim()) {
      validationErrors.firstName = "Họ là bắt buộc";
    }
    if (!lastName.trim()) {
      validationErrors.lastName = "Tên là bắt buộc";
    }
    if (!validatePassword(password)) {
      validationErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
    }
    if (password !== rePassword) {
      validationErrors.rePassword = "Mật khẩu không khớp";
    }
    if (!phone.trim()) {
      validationErrors.phone = "Số điện thoại là bắt buộc";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    dispatch(resetError()); // Đặt lại lỗi trước khi gọi 

    try {
      const newUserData = {
        firstName,
        lastName,
        email,
        pass: password,
        confirmPassword: rePassword,
        phone,
        role: 'customer',
      };

      await dispatch(registerUser(newUserData));
      setUserData(newUserData); // Lưu trữ userData vào trạng thái

      if (successRegister) {
        Swal.fire({
          title: "Success",
          text: successRegister,
          icon: "success",
          timer: 5000,
          showConfirmButton: false,
        });
        onRegisterSuccess(email, newUserData); // Truyền userData vào onRegisterSuccess
      }

      if (errorRegister) {
        Swal.fire({
          title: "Error",
          text: errorRegister || "Registration failed. Please try again.",
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
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

  return (
    <div className="register-container">
      {loading && <Loading />}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Tạo tài khoản mới</h2>

        <div className="form-group">
          <div className="name-inputs">
            <div className="name-input">
              <label className="label-text">Họ</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nhập họ của bạn"
                required
                disabled={loading}
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="name-input">
              <label className="label-text">Tên</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nhập tên của bạn"
                required
                disabled={loading}
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="label-text">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="label-text">Mật khẩu</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập vào mật khẩu"
              required
              disabled={loading}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label className="label-text">Nhập lại mật khẩu</label>
          <div className="password-container">
            <input
              type={showRePassword ? "text" : "password"}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              disabled={loading}
            />
            <span
              className="password-toggle"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.rePassword && <p className="error-text">{errors.rePassword}</p>}
        </div>

        <div className="form-group">
          <label className="label-text">Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập vào số điện thoại của bạn"
            required
            disabled={loading}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          className="signup-button"
          disabled={loading}
        >
          {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
        </button>

        <p className="signin-link">
          Bạn đã có tài khoản? <a href="/login">Đăng nhập tại đây!</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;