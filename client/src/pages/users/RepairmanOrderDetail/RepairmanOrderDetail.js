import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../component/Loading/Loading";
import "./RepairmanOrderDetail.css";

const RepairmanOrderDetail = () => {
    const location = useLocation();
    const { customerRequest } = location.state || {}; // Extract customerRequest from state

    const [isCompleted, setIsCompleted] = useState(false); // Track if the repair is confirmed as completed

    // Handle "Xác nhận hoàn tất sửa chữa" button click
    const handleConfirmCompletion = () => {
        // Placeholder for confirmation logic (e.g., API call to update request status)
        setIsCompleted(true);
        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Bạn đã xác nhận hoàn tất sửa chữa!",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: false,
        });
    };

    if (!customerRequest) {
        return <div>Không tìm thấy thông tin đơn hàng hoặc khách hàng.</div>;
    }

    const customer = customerRequest.user_id || {};
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || "Khách hàng ẩn danh";

    return (
        <div className="repairman-order-detail-container">
            {/* Notification Message */}
            <div className="notification-banner">
                <p>
                    Khách hàng <strong>{fullName}</strong> đã chốt giá của bạn. Hãy tới địa chỉ{" "}
                    <strong>{customerRequest.address}</strong> để sửa chữa ngay!
                </p>
            </div>

            {/* Customer and Request Details */}
            <div className="order-detail-content">
                {/* Customer Information */}
                <div className="section customer-info">
                    <h2 className="section-title">Thông tin khách hàng</h2>
                    <div className="customer-header">
                        {customer.imgAvt && (
                            <img
                                src={customer.imgAvt}
                                alt={fullName}
                                className="customer-avatar"
                            />
                        )}
                        <div className="customer-details">
                            <h3 className="customer-name">{fullName}</h3>
                            <p className="customer-email">Email: {customer.email || "Không có"}</p>
                            <p className="customer-phone">Số điện thoại: {customer.phone || "Không có"}</p>
                        </div>
                    </div>
                </div>

                {/* Request Information */}
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
                        <span className="info-value">{customerRequest.status}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">{new Date(customerRequest.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {customerRequest.image && (
                        <div className="info-item">
                            <span className="info-label">Hình ảnh:</span>
                            <img src={customerRequest.image} alt="Request" className="request-image" />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="action-buttons">
                {!isCompleted && (
                    <button className="confirm-btn" onClick={handleConfirmCompletion}>
                        Xác nhận hoàn tất sửa chữa
                    </button>
                )}
            </div>
        </div>
    );
};

export default RepairmanOrderDetail;