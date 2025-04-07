import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../component/Loading/Loading";
import "./RepairmanOrderDetail.css";
import { confirmRequestRepairman, resetError, resetSuccess } from "../../../store/actions/userActions.js";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate vào import

const RepairmanOrderDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { customerRequest } = location.state || {};
    const { loading, successConfirmRequestRepairman, errorConfirmRequestRepairman } = useSelector(state => state.user);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (successConfirmRequestRepairman) {
            Swal.fire({
                title: "Thành công",
                text: successConfirmRequestRepairman, // EM là string từ backend
                icon: "success",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            setIsCompleted(true); // Ẩn nút sau khi confirm thành công
            dispatch(resetSuccess());
        }

        if (errorConfirmRequestRepairman) {
            Swal.fire({
                title: "Lỗi",
                text: errorConfirmRequestRepairman, // EM là string từ backend
                icon: "error",
                timer: 5000,
                showConfirmButton: false,
                timerProgressBar: true,
                showCloseButton: false,
            });
            dispatch(resetError());
        }
    }, [successConfirmRequestRepairman, errorConfirmRequestRepairman, dispatch]);

    const handleConfirmCompletion = () => {
        dispatch(confirmRequestRepairman()); // Không cần truyền confirmData
    };

    const handleBackToRequests = () => {
        navigate("/repairman/view-requests"); // Điều hướng về trang quản lý đơn sửa chữa
    };

    if (!customerRequest) {
        return <div>Không tìm thấy thông tin đơn hàng hoặc khách hàng.</div>;
    }

    if (loading) {
        return <Loading />;
    }

    const customer = customerRequest.user_id || {};
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || "Khách hàng ẩn danh";

    return (
        <div className="repairman-order-detail-container">
            <div className="notification-banner">
                <p>
                    Khách hàng <strong>{fullName}</strong> đã chốt giá của bạn. Hãy tới địa chỉ{" "}
                    <strong>{customerRequest.address}</strong> để sửa chữa ngay!
                </p>
            </div>

            <div className="order-detail-content">
                <div className="section customer-info">
                    <h2 className="section-title">Thông tin khách hàng</h2>
                    <div className="customer-header">
                        {customer.imgAvt && (
                            <img src={customer.imgAvt} alt={fullName} className="customer-avatar" />
                        )}
                        <div className="customer-details">
                            <h3 className="customer-name">{fullName}</h3>
                            <p className="customer-email">Email: {customer.email || "Không có"}</p>
                            <p className="customer-phone">Số điện thoại: {customer.phone || "Không có"}</p>
                        </div>
                    </div>
                </div>

                <div className="section request-info">
                    <h2 className="section-title">Thông tin đơn hàng</h2>
                    <div className="info-item">
                        <span className="info-label">Mã đơn hàng:</span>
                        <span className="info-value">{customerRequest._id}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Địa chỉ:</span>
                        <span className="info-value">{customerRequest.address}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mô tả:</span>
                        <span className="info-value">{customerRequest.description || "Không có mô tả"}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">
                            {
                                customerRequest.status === "Completed" ? "Đã hoàn thành" :
                                    customerRequest.status === "Confirmed" ? "Đã xác nhận" :
                                        customerRequest.status === "Pending" ? "Đang chờ xử lý" :
                                            customerRequest.status === "Cancelled" ? "Đã hủy" :
                                                customerRequest.status === "Requesting Details" ? "Yêu cầu chi tiết" :
                                                    customerRequest.status === "Deal price" ? "Thỏa thuận giá" :
                                                        customerRequest.status === "Done deal price" ? "Đã chốt giá" :
                                                            customerRequest.status === "Make payment" ? "Chờ thanh toán" :
                                                                customerRequest.status === "Repairman confirmed completion" ? "Thợ xác nhận hoàn thành" :
                                                                    customerRequest.status === "Proceed with repair" ? "Tiến hành sửa chữa" :
                                                                        "Trạng thái không xác định"
                            }
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">{new Date(customerRequest.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {customerRequest.image && Array.isArray(customerRequest.image) && customerRequest.image.length > 0 && (
                        <div className="info-item">
                            <span className="info-label">Hình ảnh:</span>
                            <div className="request-images-container">
                                {customerRequest.image.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Request ${index + 1}`}
                                        className="request-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="action-buttons">
                <button
                    className="back-btn"
                    onClick={handleBackToRequests}
                >
                    Quay lại
                </button>
                {!isCompleted && (
                    <button
                        className="confirm-btn"
                        onClick={handleConfirmCompletion}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận hoàn tất sửa chữa"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RepairmanOrderDetail;