import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ResetPasswordForm from "./ResetPassword";
import Loading from "../../Loading/Loading";
import "../register/RegisterForm.scss";
import { forgotPassword, verifyOtp } from '../../../store/actions/authActions';

const VerifyOTP = ({ email }) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const { loading, successVerifyOTP, errorVerifyOTP } = useSelector((state) => state.auth);

    const [isInputOtp, setIsInputOtp] = useState(false); // Biến state để kiểm tra trạng thái nhập OTP

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

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

    const handleResend = async () => {
        if (canResend && !isLoading) {
            setIsLoading(true);
            try {
                await dispatch(forgotPassword(email)); // Gọi action forgotPassword
                setTimer(60); // Reset timer
                setCanResend(false); // Không cho phép gửi lại mã ngay lập tức
            } catch (err) {
                setErrors("Gửi lại mã thất bại. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Theo dõi successMessage và errorMessage từ Redux
    useEffect(() => {
        if (successVerifyOTP) {
            Swal.fire({
                title: "Thành công",
                text: successVerifyOTP,
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
            });
            setIsInputOtp(true); // // Chuyển sang reset pass sau khi gửi thành công
        }

        if (errorVerifyOTP) {
            Swal.fire({
                title: "Lỗi",
                text: errorVerifyOTP,
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
            });
            setErrors(errorVerifyOTP); // Cập nhật lỗi nếu có
        }
    }, [successVerifyOTP, errorVerifyOTP]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const fullCode = code.join("");

        if (fullCode.length !== 6 || isNaN(fullCode)) {
            setErrors("Vui lòng nhập mã OTP 6 số hợp lệ");
            setIsLoading(false);
            return;
        }

        // Gọi action verifyOtp
        dispatch(verifyOtp(email, fullCode));
        setIsLoading(false); // Đặt lại trạng thái loading
    };

    return (
        <div className="register-container">
            {loading && <Loading />}
            {!isInputOtp ? (
                <form className="register-form" onSubmit={handleSubmit}>
                    <p className="welcome-text">XÁC THỰC OTP</p>
                    <p className="register-title2">Nhập mã xác thực đã gửi đến {email}</p>
                    <div className="form-group otp-group">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                maxLength="1"
                                className="otp-input"
                                required
                                disabled={isLoading || loading}
                            />
                        ))}
                    </div>
                    {errors && <p className="error-message">{errors}</p>}
                    <button type="submit" className="signup-button" disabled={isLoading || loading}>
                        {isLoading || loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
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
            ) : (
                <ResetPasswordForm />
            )}
        </div>
    );
};

export default VerifyOTP;