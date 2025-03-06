import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MakePayment.css";

const MakePayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { repairman, dealPrice } = location.state || {};

    // Giả lập số dư tài khoản (có thể lấy từ API hoặc Redux)
    const [walletBalance] = useState(1000000); // Số dư tài khoản: 1,000,000 VNĐ
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePaymentWithWallet = async () => {
        setIsProcessing(true);
        try {
            // Giả lập gọi API thanh toán bằng ví tài khoản
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 giây để giả lập

            if (walletBalance < dealPrice) {
                alert("Số dư tài khoản không đủ để thanh toán!");
                return;
            }

            alert("Thanh toán thành công!");
            // Chuyển hướng đến trang .booking
            navigate("/booking", { state: { repairman, paymentMethod: "wallet" } });
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại!");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentWithCash = () => {
        // Chuyển hướng ngay đến trang .booking
        navigate("/booking", { state: { repairman, paymentMethod: "cash" } });
    };

    if (!repairman || !dealPrice) {
        return <div>Không tìm thấy thông tin để thanh toán.</div>;
    }

    return (
        <div className="payment-page">
            <h2 className="payment-title">Thanh toán đặt thợ</h2>
            <div className="payment-container">
                <div className="payment-info">
                    <h3 className="section-title">Thông tin thanh toán</h3>
                    <div className="info-item">
                        <label className="info-label">Thợ:</label>
                        <span className="info-value">{repairman.fullName}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Số tiền cần thanh toán:</label>
                        <span className="info-value">{dealPrice.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Số dư tài khoản:</label>
                        <span className="info-value">{walletBalance.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                </div>

                <div className="payment-options">
                    <h3 className="section-title">Phương thức thanh toán</h3>
                    <div className="option-buttons">
                        <button
                            className="option-btn wallet-btn"
                            onClick={handlePaymentWithWallet}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Đang xử lý..." : "Thanh toán bằng ví tài khoản"}
                        </button>
                        <button
                            className="option-btn cash-btn"
                            onClick={handlePaymentWithCash}
                            disabled={isProcessing}
                        >
                            Thanh toán bằng tiền mặt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakePayment;