import React from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // Thêm React Portal
import "./RepairmanInforModal.css";

const RepairmanInfoModal = ({ isOpen, onClose, repairman }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const {
        fullName = "Không có dữ liệu",
        profileImage = null,
        description = "Không có mô tả",
        dealPrice = 0,
        certificationImages = [],
        bookingCount = 0,
        reviews = [],
    } = repairman || {};

    const handleBook = () => {
        onClose();
        navigate("/make-payment", { state: { repairman, dealPrice } });
        console.log(repairman);
        console.log(dealPrice);
    };

    // Nội dung modal
    const modalContent = (
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
                                <img src={profileImage} alt="Ảnh thợ" className="profile-image" />
                            </div>
                        )}
                        {certificationImages.length > 0 && (
                            <div className="info-section">
                                <label className="info-label">Giấy chứng chỉ hành nghề:</label>
                                <div className="certification-images">
                                    {certificationImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Chứng chỉ ${index + 1}`}
                                            className="certification-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="info-block">
                        <h3 className="block-title">Thông tin dịch vụ</h3>
                        <div className="info-row">
                            <div className="info-section">
                                <label className="info-label">Giá đã deal:</label>
                                <p className="info-value">{dealPrice.toLocaleString("vi-VN")} VNĐ</p>
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

    // Sử dụng Portal để render modal vào body
    return createPortal(modalContent, document.body);
};

export default RepairmanInfoModal;