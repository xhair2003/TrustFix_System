import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { paymentMOMO, paymentPayOS, resetMOMOPayment, resetPayOSPayment } from "../../../../store/actions/paymentActions";
import Swal from "sweetalert2";
import "./Deposit.css";

const Deposit = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { paymentMethod } = location.state || {}; // Lấy giá trị paymentMethod từ state (Momo hoặc PayOS)
    console.log(paymentMethod);

    const {
        loadingMOMO, paymentMOMOUrl, successMOMOPayment, errorMOMOPayment,
        loadingPayOS, paymentPayOSUrl, successPayOSPayment, errorPayOSPayment
    } = useSelector((state) => state.payment);

    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [customAmount, setCustomAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle MoMo success
    useEffect(() => {
        if (successMOMOPayment && paymentMOMOUrl) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: successMOMOPayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetMOMOPayment()); // Reset MoMo state
                window.location.href = paymentMOMOUrl; // Redirect to MoMo payment URL
            });
        }
    }, [successMOMOPayment, paymentMOMOUrl, dispatch]);

    // Handle MoMo error
    useEffect(() => {
        if (errorMOMOPayment) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorMOMOPayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetMOMOPayment()); // Reset MoMo state
            });
        }
    }, [errorMOMOPayment, dispatch]);

    // Handle PayOS success
    useEffect(() => {
        if (successPayOSPayment && paymentPayOSUrl) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: successPayOSPayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetPayOSPayment()); // Reset PayOS state
                window.location.href = paymentPayOSUrl; // Redirect to PayOS payment URL
            });
        }
    }, [successPayOSPayment, paymentPayOSUrl, dispatch]);

    // Handle PayOS error
    useEffect(() => {
        if (errorPayOSPayment) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorPayOSPayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetPayOSPayment()); // Reset PayOS state
            });
        }
    }, [errorPayOSPayment, dispatch]);

    const handleAmountChange = (event) => {
        const amount = Number(event.target.value);
        setSelectedAmount(amount);
        setCustomAmount(amount.toString());
    };

    const handleCustomAmountChange = (event) => {
        setSelectedAmount(null);
        setCustomAmount(event.target.value);
    };

    const convertToWords = (amount) => {
        if (!amount) return "";
        const number = Number(amount);
        return number.toLocaleString("vi-VN") + " đồng";
    };

    const renderAmountMessage = () => {
        const amountToDisplay = customAmount || selectedAmount;
        if (amountToDisplay) {
            return (
                <p className="amount-message">
                    Số tiền nạp: {convertToWords(amountToDisplay)}
                </p>
            );
        }
        return null;
    };

    const handleSubmitPayment = async () => {
        const amountToPay = Number(customAmount || selectedAmount);

        if (!amountToPay || amountToPay <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Cảnh báo",
                text: "Vui lòng nhập số tiền hợp lệ để nạp!",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            });
            return;
        }

        if (!paymentMethod) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Phương thức thanh toán không được xác định!",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            });
            return;
        }

        setIsProcessing(true);
        try {
            if (paymentMethod === "MOMO") {
                await dispatch(paymentMOMO(amountToPay));
            } else if (paymentMethod === "PayOS") {
                await dispatch(paymentPayOS(amountToPay));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Phương thức thanh toán không hợp lệ!",
                    timer: 5000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: false,
                });
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-content">
                <h1 className="payment-title">Chọn số tiền cần nạp</h1>

                <p className="section-label">Chọn nhanh số tiền cần nạp</p>
                <div className="amount-options">
                    {[50000, 100000, 200000, 500000, 1000000, 2000000, 5000000].map((amount) => (
                        <label key={amount} className="amount-option">
                            <input
                                type="radio"
                                value={amount}
                                checked={selectedAmount === amount}
                                onChange={handleAmountChange}
                                className="amount-radio"
                                disabled={isProcessing}
                            />
                            {amount.toLocaleString("vi-VN")} đ
                        </label>
                    ))}
                </div>

                <p className="section-label">Hoặc nhập số tiền cần nạp</p>
                <div className="custom-amount-wrapper">
                    <input
                        type="text"
                        placeholder="Nhập số tiền cần nạp"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="custom-amount-input"
                        disabled={isProcessing}
                    />
                    <span className="currency-label">vnd</span>
                </div>

                {renderAmountMessage()}
                <button
                    className="submit-button"
                    onClick={handleSubmitPayment}
                    disabled={isProcessing || loadingMOMO || loadingPayOS}
                >
                    {isProcessing || loadingMOMO || loadingPayOS ? "Đang xử lý..." : "Tiếp tục"}
                </button>

                <div className="important-note">
                    <p className="note-title">Lưu ý quan trọng:</p>
                    <p>
                        Trong quá trình thanh toán, bạn vui lòng <strong>KHÔNG ĐÓNG TRÌNH DUYỆT</strong>.
                    </p>
                    <p>
                        Nếu gặp khó khăn trong quá trình thanh toán, xin liên hệ{" "}
                        <strong>0945201693</strong> để chúng tôi hỗ trợ bạn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Deposit;