import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetError, resetSuccess } from "../../../store/actions/authActions";
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

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Kiểm tra số điện thoại 10 chữ số
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng, hỗ trợ tiếng Việt
    return nameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi kiểm tra

    // Loại bỏ khoảng trắng từ các trường nhập liệu
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRePassword = rePassword.trim();
    const trimmedPhone = phone.trim();

    let validationErrors = {};
    if (!trimmedFirstName) {
      validationErrors.firstName = "Họ là bắt buộc";
    } else if (!validateName(trimmedFirstName)) {
      validationErrors.firstName = "Họ không được chứa ký tự đặc biệt";
    }

    if (!trimmedLastName) {
      validationErrors.lastName = "Tên là bắt buộc";
    } else if (!validateName(trimmedLastName)) {
      validationErrors.lastName = "Tên không được chứa ký tự đặc biệt";
    }

    if (!validatePassword(trimmedPassword)) {
      validationErrors.password = "Mật khẩu phải ít nhất 8 ký tự";
    }
    if (trimmedPassword !== trimmedRePassword) {
      validationErrors.rePassword = "Mật khẩu không khớp";
    }
    if (!validatePhone(trimmedPhone)) {
      validationErrors.phone = "Số điện thoại không hợp lệ (phải là 10 chữ số)";
    } else if (!trimmedPhone) {
      validationErrors.phone = "Số điện thoại là bắt buộc";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newUserData = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        pass: trimmedPassword,
        confirmPassword: trimmedRePassword,
        phone: trimmedPhone,
        role: 'customer',
      };

      await dispatch(registerUser(newUserData));
      setUserData(newUserData); // Lưu trữ userData vào trạng thái

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

  useEffect(() => {
    if (successRegister) {
      Swal.fire({
        title: "Success",
        text: successRegister,
        icon: "success",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetSuccess());
      onRegisterSuccess(email); // Truyền userData vào onRegisterSuccess
    }

    if (errorRegister) {
      Swal.fire({
        title: "Error",
        text: errorRegister,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      dispatch(resetError()); // Đặt lại lỗi trước khi gọi 
    }
  }, [dispatch, successRegister, errorRegister, onRegisterSuccess, email]);

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