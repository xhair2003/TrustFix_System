import React, { useState } from "react";
import "./RatingModal.css";

const RatingModal = ({ isOpen, onClose, onSubmit, repairmanName }) => {
    const [rating, setRating] = useState(0); // Chỉ giữ một giá trị sao tổng thể
    const [criteria, setCriteria] = useState([]); // Lưu các tiêu chí được chọn
    const [comment, setComment] = useState("");

    // Danh sách tiêu chí tùy chọn
    const availableCriteria = [
        "Chất lượng sửa chữa",
        "Đúng giờ",
        "Thái độ phục vụ",
        "Giá cả hợp lý",
    ];

    // Xử lý khi người dùng chọn số sao
    const handleRatingChange = (value) => {
        setRating(value);
    };

    // Xử lý khi người dùng chọn tiêu chí
    const handleCriteriaChange = (criterion) => {
        setCriteria((prev) =>
            prev.includes(criterion)
                ? prev.filter((item) => item !== criterion)
                : [...prev, criterion]
        );
    };

    // Xử lý gửi đánh giá
    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Vui lòng chọn số sao để đánh giá!");
            return;
        }

        // Gửi dữ liệu đánh giá
        onSubmit({ rating, criteria, comment });
        // Reset form và đóng modal
        setRating(0);
        setCriteria([]);
        setComment("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Đánh giá thợ sửa chữa</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">
                        Đánh giá thợ: <strong>{repairmanName}</strong>
                    </p>

                    {/* Đánh giá sao tổng thể */}
                    <div className="rating-section">
                        <label className="rating-label">Đánh giá tổng thể:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? "filled" : ""} `}
                                    onClick={() => handleRatingChange(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tiêu chí tùy chọn */}
                    <div className="criteria-section">
                        <label className="criteria-label">
                            Chọn các tiêu chí bạn muốn đề cập (sẽ được đưa vào bình luận):
                        </label>
                        <div className="criteria-options">
                            {availableCriteria.map((criterion) => (
                                <label key={criterion} className="criteria-option">
                                    <input
                                        type="checkbox"
                                        checked={criteria.includes(criterion)}
                                        onChange={() => handleCriteriaChange(criterion)}
                                    />
                                    <span>{criterion}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Input nhận xét chi tiết */}
                    <div className="comment-section">
                        <label className="comment-label">Nhận xét chi tiết:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Nhập nhận xét của bạn về thợ sửa chữa..."
                            className="comment-input"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="submit-btn" onClick={handleSubmit}>
                        Gửi đánh giá
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;