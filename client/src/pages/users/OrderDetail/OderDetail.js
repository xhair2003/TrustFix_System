import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingModal from '../../../component/users/RatingModal/RatingModal'
import './OrderDetail.css';

const OrderDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { repairman, request } = location.state || {};

    const [isCompleted, setIsCompleted] = useState(false); // Track if the repair is confirmed as completed
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false); // Control the rating modal

    // Handle "Khiếu nại" button click
    const handleComplain = () => {
        navigate("/complain", { state: { request, repairman } });
    };

    // Handle "Xác nhận thợ đã sửa xong" button click
    const handleConfirmCompletion = () => {
        // Placeholder for confirmation logic (e.g., API call to update order status)
        // For now, we'll simulate a successful confirmation
        setIsCompleted(true);
    };

    // Handle opening the rating modal
    const handleOpenRatingModal = () => {
        setIsRatingModalOpen(true);
    };

    if (!repairman || !request) {
        return <div>Không tìm thấy thông tin đơn hàng hoặc thợ sửa chữa.</div>;
    }

    return (
        <div className="order-detail-container">
            {/* Notification Message */}
            <div className="notification-banner">
                <p>
                    Thợ <strong>{repairman.fullName}</strong> đã tiếp nhận đầy đủ thông tin của bạn và đơn hàng. Họ sẽ tới địa chỉ{" "}
                    <strong>{request.address}</strong> để sửa nhanh thôi!
                </p>
            </div>

            {/* Order and Repairman Details */}
            <div className="order-detail-content">
                {/* Order Information */}
                <div className="section order-info">
                    <h2 className="section-title">Thông tin đơn hàng</h2>
                    <div className="info-item">
                        <span className="info-label">Mã đơn hàng:</span>
                        <span className="info-value">{request.requestId}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Địa chỉ:</span>
                        <span className="info-value">{request.address}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Mô tả:</span>
                        <span className="info-value">{request.descriptions}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">{request.status}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Ngày tạo:</span>
                        <span className="info-value">{request.createdAt}</span>
                    </div>
                    {request.image && (
                        <div className="info-item">
                            <span className="info-label">Hình ảnh:</span>
                            <img src={request.image} alt="Order" className="order-image" />
                        </div>
                    )}
                </div>

                {/* Repairman Information */}
                <div className="section repairman-info">
                    <h2 className="section-title">Thông tin thợ sửa chữa</h2>
                    <div className="repairman-header">
                        {repairman.profileImage && (
                            <img
                                src={repairman.profileImage}
                                alt={repairman.fullName}
                                className="repairman-avatar"
                            />
                        )}
                        <div className="repairman-details">
                            <h3 className="repairman-name">{repairman.fullName}</h3>
                            <p className="repairman-description">{repairman.description}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Số tiền thanh toán:</span>
                        <span className="info-value">{repairman.dealPrice.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Số đơn đã nhận:</span>
                        <span className="info-value">{repairman.bookingCount}</span>
                    </div>
                    {repairman.certificationImages.length > 0 && (
                        <div className="info-item">
                            <span className="info-label">Chứng chỉ:</span>
                            <div className="certification-gallery">
                                {repairman.certificationImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Certification ${index + 1}`}
                                        className="certification-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                {repairman.reviews.length > 0 && (
                    <div className="section reviews-section">
                        <h2 className="section-title">Đánh giá từ khách hàng</h2>
                        {repairman.reviews.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <span className="reviewer-name">{review.reviewerName}</span>
                                    <span className="review-date">{review.date}</span>
                                </div>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`star ${i < review.rating ? "filled" : ""}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button className="complain-btn" onClick={handleComplain}>
                    Khiếu nại
                </button>
                {isCompleted ? (
                    <button className="rate-btn" onClick={handleOpenRatingModal}>
                        Đánh giá thợ
                    </button>
                ) : (
                    <button className="confirm-btn" onClick={handleConfirmCompletion}>
                        Xác nhận thợ đã sửa xong
                    </button>
                )}
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                repairmanName={repairman.fullName}
                requestId={request.requestId}
            />
        </div>
    );
};

export default OrderDetail;