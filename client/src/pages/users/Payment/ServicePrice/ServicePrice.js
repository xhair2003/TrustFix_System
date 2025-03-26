import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVips, fetchBalance, purchaseVip, resetError, resetSuccess } from '../../../../store/actions/userActions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ServicePrice.css';
import Loading from '../../../../component/Loading/Loading';

const ServicePrice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { vips, loading, errorFetchBalance, balance, successPurchaseVip, errorPurchaseVip } = useSelector(
        (state) => state.user
    );
    const [typeServices, setTypeServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVip, setSelectedVip] = useState(null);

    // Fetch danh sách VIP và số dư ví
    useEffect(() => {
        dispatch(fetchAllVips());
        dispatch(fetchBalance());
    }, [dispatch]);

    useEffect(() => {
        if (!loading && vips.length > 0) {
            setTypeServices(vips);
        }
    }, [loading, vips]);

    // Xử lý thông báo Swal cho errorFetchBalance, successPurchaseVip, errorPurchaseVip
    useEffect(() => {
        if (errorFetchBalance) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorFetchBalance,
                timer: 5000, // 5 giây
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset lỗi sau khi thông báo
            });
        }
    }, [errorFetchBalance, dispatch]);

    useEffect(() => {
        if (successPurchaseVip) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: successPurchaseVip,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: false,
            }).then(() => {
                dispatch(resetSuccess()); // Reset thành công sau khi thông báo
            });
        }
    }, [successPurchaseVip, dispatch]);

    useEffect(() => {
        if (errorPurchaseVip) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorPurchaseVip,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCancelButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset lỗi sau khi thông báo
            });
        }
    }, [errorPurchaseVip, dispatch]);

    // Mở modal khi nhấn "Áp dụng ngay"
    const handleOpenModal = (vip) => {
        setSelectedVip(vip);
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVip(null);
    };

    // Xử lý thanh toán
    const handleConfirmPurchase = () => {
        if (selectedVip && balance >= selectedVip.price) {
            dispatch(purchaseVip(selectedVip._id));
            setShowModal(false); // Đóng modal ngay khi gửi yêu cầu
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="sp-container">
            <div className="sp-content-wrapper">
                <div className="sp-header">
                    <h2 className="sp-title">Bảng Giá Dịch Vụ Tăng Đề Xuất</h2>
                    <p className="sp-subtitle">Chọn phương án hoàn hảo cho nhu cầu của bạn</p>
                </div>

                <div className="sp-grid">
                    {typeServices.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="sp-card"
                        >
                            <div className="sp-card-content">
                                <h3 className="sp-card-title">{item.description}</h3>
                                <div className="sp-price-wrapper">
                                    <span className="sp-price">{new Intl.NumberFormat('vi-VN').format(item.price)}</span>
                                    <span className="sp-unit">VNĐ đồng</span>
                                </div>

                                <div className="sp-features">
                                    {item.description
                                        .split('.')
                                        .filter((sentence) => sentence.trim() !== '')
                                        .map((sentence, index) => (
                                            <div key={index} className="sp-feature-item">
                                                <FiCheckCircle className="sp-feature-icon" />
                                                <span className="sp-feature-text">{sentence.trim()}</span>
                                            </div>
                                        ))}
                                </div>

                                <motion.button
                                    onClick={() => handleOpenModal(item)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="sp-button"
                                >
                                    Áp dụng ngay
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal thanh toán */}
            {showModal && selectedVip && (
                <div className="modal-overlay" style={modalOverlayStyle}>
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={modalContentStyle}
                    >
                        <h3>Xác nhận thanh toán</h3>
                        <div>
                            <p style={{ color: 'green' }}>
                                Số dư ví:{' '}
                                <span >
                                    {new Intl.NumberFormat('vi-VN').format(balance)} VNĐ
                                </span>
                            </p>
                            <p>
                                Giá tiền:{' '}
                                <span style={{ color: 'black' }}>
                                    {new Intl.NumberFormat('vi-VN').format(selectedVip.price)} VNĐ
                                </span>
                            </p>

                            {balance < selectedVip.price && (
                                <p style={{ color: 'red' }}>
                                    Số dư ví không đủ, vui lòng{' '}
                                    <span
                                        style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                                        onClick={() => navigate('/wallet')}
                                    >
                                        nạp thêm tiền vào tài khoản!
                                    </span>
                                </p>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <button
                                    onClick={handleConfirmPurchase}
                                    disabled={balance < selectedVip.price}
                                    style={{
                                        ...modalButtonStyle,
                                        backgroundColor: balance < selectedVip.price ? '#ccc' : '#007bff',
                                        cursor: balance < selectedVip.price ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Xác nhận
                                </button>
                                <button onClick={handleCloseModal} style={modalButtonStyle}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// CSS inline cho modal
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
};

const modalButtonStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
};

export default ServicePrice;