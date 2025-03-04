import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { apiGetWalletBalance } from '../../../services/Wallet'; 
import './Wallet.css';
import bankTransfer from "../../../../assets/Images/bankTransfer.png";
import momo_icon from "../../../../assets/Images/momo_icon.svg";
import momo from "../../../../assets/Images/momo.png";
import credit from "../../../../assets/Images/credit.svg";

const Wallet = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);

    const convertToWords = (amount) => {
        if (!amount) return '';
        const number = Number(amount);
        return number.toLocaleString('vi-VN') + ' đồng';
    };

    // useEffect(() => {
    //     const fetchBalance = async () => {
    //         try {
    //             const res = await apiGetWalletBalance(); // Gọi API để lấy số dư
    //             if (res.status === 200) {
    //                 setBalance(res.data.balance);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching wallet balance:', error);
    //         }
    //     };
    //     fetchBalance();
    // }, []);

    return (
        <div className="deposit-container">
            <div className="breadcrumb"> {/* Breadcrumb Component Can Go Here */} </div>
            <div className="deposit-card">
                <h1 className="deposit-title">
                    Ví tiền tài khoản
                </h1>
                <div className="deposit-flex-container">
                    {/* Phần Chọn Phương Thức Nạp Tiền */}
                    <div className="deposit-method-container">
                        <h2 className="deposit-subtitle">
                            Mời bạn chọn phương thức nạp tiền
                        </h2>
                        <div className="deposit-methods">
                            <button className="method-btn bank-transfer" onClick={() => navigate("/bank-transfer")}>
                                <img alt="Bank Transfer Icon" className="method-icon" height="100" src={credit} width="100" />
                                <div className="method-name">
                                    <p>Chuyển khoản</p>
                                </div>
                            </button>

                            <button className="method-btn momo" onClick={() => navigate("/momo")}>
                                <img alt="MOMO Icon" className="method-icon" height="100" src={momo_icon} width="100" />
                                <div className="method-name">
                                    <p>MOMO</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Phần Thông Tin Số Dư và Tùy Chọn */}
                    <div className="account-info">
                        <div className="balance-info">
                            <p className="balance-title">Số dư tài khoản</p>
                            <p className="balance-amount">
                                {convertToWords(500000)}
                            </p>
                        </div>
                        <div className="options">
                            <button className="option-btn" onClick={() => navigate("deposit-history")}>
                                Lịch sử nạp tiền
                            </button>
                            <button className="option-btn" onClick={() => navigate("history-payment")}>
                                Lịch sử thanh toán
                            </button>
                            <button className="option-btn" onClick={() => navigate("repairman/service-price")}>
                                Bảng giá dịch vụ tăng đề xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Wallet;
