// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchBalance, assignRepairman, resetError, resetSuccess } from '../../../../store/actions/userActions';
// import { useDispatch, useSelector } from 'react-redux';
// import Loading from '../../../../component/Loading/Loading';
// import "./MakePayment.css";
// import Swal from "sweetalert2";

// const MakePayment = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { repairman, request } = location.state || {};
//     const { balance, loading, errorFetchBalance } = useSelector((state) => state.user);
//     const [isProcessing, setIsProcessing] = useState(false);

//     useEffect(() => {
//         dispatch(fetchBalance());
//     }, [dispatch]);

//     if (loading) {
//         return <Loading />;
//     }

//     if (errorFetchBalance) {
//         return <p style={{ color: 'red' }}>{errorFetchBalance}</p>;
//     }

//     const handlePaymentWithWallet = async () => {
//         setIsProcessing(true);
//         try {
//             // Giả lập gọi API thanh toán bằng ví tài khoản
//             await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 giây để giả lập

//             // if (walletBalance < dealPrice) {
//             //     alert("Số dư tài khoản không đủ để thanh toán!");
//             //     return;
//             // }

//             alert("Thanh toán thành công!");
//             // Chuyển hướng đến trang .booking
//             navigate("/booking", { state: { repairman, paymentMethod: "wallet" } });
//         } catch (error) {
//             console.error("Lỗi thanh toán:", error);
//             alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại!");
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (!repairman || !repairman.dealPrice) {
//         return <div>Không tìm thấy thông tin để thanh toán.</div>;
//     }

//     return (
//         <div className="payment-page">
//             <h2 className="payment-title">Thanh toán đặt thợ</h2>
//             <div className="payment-container">
//                 <div className="payment-info">
//                     <h3 className="section-title">Thông tin thanh toán</h3>
//                     <div className="info-item">
//                         <label className="info-label">Thợ:</label>
//                         <span className="info-value">{repairman.fullName}</span>
//                     </div>
//                     <div className="info-item">
//                         <label className="info-label">Số tiền cần thanh toán:</label>
//                         <span className="info-value">{repairman.dealPrice.toLocaleString("vi-VN")} VNĐ</span>
//                     </div>
//                     <div className="info-item">
//                         <label className="info-label">Số dư tài khoản:</label>
//                         <span className="info-value">{balance.toLocaleString("vi-VN")} VNĐ</span>
//                     </div>
//                 </div>

//                 <div className="payment-options">
//                     <div className="option-buttons">
//                         <button
//                             className="option-btn wallet-btn"
//                             onClick={handlePaymentWithWallet}
//                             disabled={isProcessing}
//                         >
//                             {isProcessing ? "Đang xử lý..." : "Thanh toán bằng ví tài khoản"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MakePayment;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchBalance, assignRepairman, resetError, resetSuccess } from '../../../../store/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../../component/Loading/Loading';
import "./MakePayment.css";
import Swal from "sweetalert2";

const MakePayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { repairman, request } = location.state || {};
    const { balance, loading, errorFetchBalance, successMakePayment, errorMakePayment } = useSelector((state) => state.user);
    const [isProcessing, setIsProcessing] = useState(false);

    console.log(repairman);

    // Fetch balance on component mount
    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch]);

    // Handle errorFetchBalance with Swal
    useEffect(() => {
        if (errorFetchBalance) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorFetchBalance,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset error after displaying
            });
        }
    }, [errorFetchBalance, dispatch]);

    // Handle successMakePayment with Swal
    useEffect(() => {
        if (successMakePayment) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: successMakePayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetSuccess()); // Reset success after displaying
                navigate(`/order-detail/${request.parentRequest}`, { state: { repairman, request } }); // Navigate after success
            });
        }
    }, [successMakePayment, dispatch, navigate, repairman, request]);

    // Handle errorMakePayment with Swal
    useEffect(() => {
        if (errorMakePayment) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: errorMakePayment,
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            }).then(() => {
                dispatch(resetError()); // Reset error after displaying
            });
        }
    }, [errorMakePayment, dispatch]);

    // Handle payment with wallet
    const handlePaymentWithWallet = async () => {
        if (balance < repairman.dealPrice) {
            Swal.fire({
                icon: "warning",
                title: "Cảnh báo",
                text: "Số dư tài khoản không đủ để thanh toán!",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: false,
            });
            return;
        }

        setIsProcessing(true);
        try {
            // Dispatch assignRepairman action
            await dispatch(assignRepairman(request.parentRequest, repairman.repairmanId));
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!repairman || !repairman.dealPrice || !request) {
        return <div>Không tìm thấy thông tin để thanh toán.</div>;
    }

    return (
        <div className="payment-page">
            <h2 className="payment-title">Thanh toán đặt thợ</h2>
            <div className="payment-container">
                {/* New Section: Thông tin đơn hàng */}
                <div className="order-info">
                    <h3 className="section-title">Thông tin đơn hàng</h3>
                    <div className="info-item">
                        <label className="info-label">Mã đơn hàng:</label>
                        <span className="info-value">{request.requestId}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Địa chỉ:</label>
                        <span className="info-value">{request.address}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Mô tả:</label>
                        <span className="info-value">{request.descriptions}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Trạng thái:</label>
                        <span className="info-value">{request.status}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Ngày tạo:</label>
                        <span className="info-value">{request.createdAt}</span>
                    </div>
                    {request.image && (
                        <div className="info-item">
                            <label className="info-label">Hình ảnh:</label>
                            <img src={request.image} alt="Order" className="order-image" />
                        </div>
                    )}
                </div>

                {/* Existing Section: Thông tin thanh toán */}
                <div className="payment-info">
                    <h3 className="section-title">Thông tin thanh toán</h3>
                    <div className="info-item">
                        <label className="info-label">Thợ:</label>
                        <span className="info-value">{repairman.fullName}</span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Số tiền cần thanh toán:</label>
                        <span className="info-value">
                            {(repairman?.dealPrice ?? 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>
                    <div className="info-item">
                        <label className="info-label">Số dư tài khoản:</label>
                        <span className="info-value">
                            {(balance ?? 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>
                </div>

                <div className="payment-options">
                    <div className="option-buttons">
                        <button
                            className="option-btn wallet-btn"
                            onClick={handlePaymentWithWallet}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Đang xử lý..." : "Thanh toán bằng ví tài khoản"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakePayment;