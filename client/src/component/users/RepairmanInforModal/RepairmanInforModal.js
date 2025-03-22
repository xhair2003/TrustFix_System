import React from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./RepairmanInforModal.css";

const RepairmanInfoModal = ({ isOpen, onClose, repairman }) => {
    const navigate = useNavigate(); // Thêm useNavigate để chuyển hướng

    if (!isOpen) return null;

    const {
        fullName = "Không có dữ liệu",
        profileImage = null,
        description = "Không có mô tả",
        dealPrice = 0,
        certificationImage = null,
        bookingCount = 0,
        reviews = [],
    } = repairman || {};

    // Xử lý khi nhấn "Đặt thợ"
    const handleBook = () => {
        onClose(); // Đóng modal
        // Chuyển hướng đến trang thanh toán với thông tin thợ và số tiền
        navigate("/make-payment", { state: { repairman, dealPrice } });
        console.log(repairman);
        console.log(dealPrice);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Thông tin thợ sửa chữa</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="info-block">
                        <h3 className="block-title">Thông tin thợ</h3>
                        <div className="info-section">
                            <label className="info-label">Họ và tên:</label>
                            <p className="info-value">{fullName}</p>
                        </div>
                        <div className="info-section">
                            <label className="info-label">Mô tả:</label>
                            <p className="info-value">{description}</p>
                        </div>
                        {profileImage && (
                            <div className="info-section">
                                <label className="info-label">Ảnh thợ:</label>
                                <img
                                    src={profileImage}
                                    alt="Ảnh thợ"
                                    className="profile-image"
                                />
                            </div>
                        )}
                        {certificationImage && (
                            <div className="info-section">
                                <label className="info-label">Giấy chứng chỉ hành nghề:</label>
                                <img
                                    src={certificationImage}
                                    alt="Chứng chỉ hành nghề"
                                    className="certification-image"
                                />
                            </div>
                        )}
                    </div>

                    <div className="info-block">
                        <h3 className="block-title">Thông tin dịch vụ</h3>
                        <div className="info-row">
                            <div className="info-section">
                                <label className="info-label">Giá đã deal:</label>
                                <p className="info-value">
                                    {dealPrice.toLocaleString("vi-VN")} VNĐ
                                </p>
                            </div>
                            <div className="info-section">
                                <label className="info-label">Tổng số lần được đặt:</label>
                                <p className="info-value">{bookingCount} lần</p>
                            </div>
                        </div>
                    </div>

                    {reviews.length > 0 && (
                        <div className="info-block">
                            <h3 className="block-title">Đánh giá</h3>
                            <div className="reviews-list">
                                {reviews.map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <span className="reviewer-name">{review.reviewerName}</span>
                                            <span className="review-date">{review.date}</span>
                                        </div>
                                        <div className="review-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`star ${review.rating >= star ? "filled" : ""}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="book-btn" onClick={handleBook}>
                        Đặt thợ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepairmanInfoModal;