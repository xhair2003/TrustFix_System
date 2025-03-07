import React, { useState } from "react";
import RatingModal from "./component/users/Rating/RatingModal";

const ParentComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitRating = (ratingData) => {
        console.log("Rating submitted:", ratingData);
        // Gọi API để gửi đánh giá, ví dụ:
        // axios.post('/api/reviews', ratingData);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Đánh giá thợ</button>
            <RatingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitRating}
                repairmanName="Nguyễn Văn A"
            />
        </div>
    );
};

export default ParentComponent;