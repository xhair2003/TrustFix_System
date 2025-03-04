import React, { useState } from "react";
//import { useLocation } from 'react-router-dom';
//import axios from "axios";
//import { useSelector } from "react-redux";
//import { Breadcrumb } from "../../../components";
import "./Deposit.css";

const Deposit = () => {
    //const location = useLocation();
    //const { paymentMethod } = location.state || {}; // Lấy giá trị paymentMethod từ state

    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [customAmount, setCustomAmount] = useState("");
    //const token = useSelector((state) => state.auth.token);
    //const breadcrumbItems = [];

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

    // const handleSubmitPayment = async () => {
    //     try {
    //         const amount = customAmount || selectedAmount;
    //         const response = await axios.post(
    //             "http://localhost:5000/api/v1/user/payment",
    //             { amount, paymentMethod },
    //             {
    //                 headers: {
    //                     token: `${token}`,
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             window.location.href = response.data.payUrl;
    //         } else {
    //             console.log("Error:", response.data.message);
    //         }
    //     } catch (error) {
    //         console.error("Failed to create payment:", error);
    //     }
    // };

    return (
        <div className="payment-container">
            {/* <Breadcrumb items={breadcrumbItems} /> */}
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
                    />
                    <span className="currency-label">vnd</span>
                </div>

                {renderAmountMessage()}
                <button className="submit-button" >
                    {/* onClick={handleSubmitPayment} */}
                    Tiếp tục
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