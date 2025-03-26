import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance } from '../../../../store/actions/userActions';
import { useNavigate } from 'react-router-dom';
import './Wallet.css';
import momo_icon from "../../../../assets/Images/momo_icon.svg";
import credit from "../../../../assets/Images/credit.svg";
import Loading from '../../../../component/Loading/Loading';

const Wallet = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { balance, loading, errorFetchBalance } = useSelector((state) => state.user);
    const { role } = useSelector((state) => state.auth);
    //console.log(errorFetchBalance);

    const convertToWords = (amount) => {
        if (!amount) return '';
        const number = Number(amount);
        return number.toLocaleString('vi-VN') + ' đồng';
    };

    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }

    if (errorFetchBalance) {
        return <p style={{ color: 'red' }}>{errorFetchBalance}</p>;
    }

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
                            <button className="method-btn bank-transfer" onClick={() => navigate("deposit", { state: { paymentMethod: 'payOS' } })}>
                                <img alt="Bank Transfer Icon" className="method-icon" height="100" src={credit} width="100" />
                                <div className="method-name">
                                    <p>Chuyển khoản</p>
                                </div>
                            </button>

                            <button className="method-btn momo" onClick={() => navigate("deposit", { state: { paymentMethod: 'Momo' } })}>
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
                                {convertToWords(balance)}
                            </p>
                        </div>
                        <div className="options">
                            <button className="option-btn" onClick={() => navigate("/deposit-history")}>
                                Lịch sử nạp tiền
                            </button>
                            <button className="option-btn" onClick={() => navigate("/history-payment")}>
                                Lịch sử thanh toán
                            </button>
                            {role === 'repairman' && (
                                <button className="option-btn" onClick={() => navigate("/repairman/service-prices")}>
                                    Bảng giá dịch vụ tăng đề xuất
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
