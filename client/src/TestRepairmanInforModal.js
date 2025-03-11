import React, { useState } from "react";
import RepairmanInforModal from "././component/users/RepairmanInforModal/RepairmanInforModal.js";

const TestRepairmanInforModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRepairman, setSelectedRepairman] = useState(null);

    const handleOpenModal = (repairman) => {
        setSelectedRepairman(repairman);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRepairman(null);
    };

    const handleBookRepairman = (repairman) => {
        console.log("Đặt thợ:", repairman);
        handleCloseModal();
    };

    // Dữ liệu giả để test
    const repairmen = [
        {
            id: 1,
            fullName: "Nguyễn Văn A",
            profileImage: "https://via.placeholder.com/150", // Ảnh thợ
            description: "Thợ sửa chữa chuyên nghiệp với 5 năm kinh nghiệm.",
            dealPrice: 500000,
            certificationImage: "https://via.placeholder.com/200", // Ảnh chứng chỉ
            bookingCount: 25,
            reviews: [
                {
                    reviewerName: "Trần Thị B",
                    date: "2025-03-01",
                    rating: 4.5,
                    comment: "Thợ rất nhiệt tình, làm việc cẩn thận.",
                },
                {
                    reviewerName: "Lê Văn C",
                    date: "2025-02-15",
                    rating: 4.0,
                    comment: "Đến đúng giờ, giá cả hợp lý.",
                },
            ],
        },
        {
            id: 2,
            fullName: "Trần Văn B",
            profileImage: "https://via.placeholder.com/150", // Ảnh thợ
            description: "Chuyên sửa chữa điện nước, nhanh gọn.",
            dealPrice: 400000,
            certificationImage: null,
            bookingCount: 10,
            reviews: [
                {
                    reviewerName: "Nguyễn Thị D",
                    date: "2025-01-20",
                    rating: 3.8,
                    comment: "Làm việc ổn, nhưng cần cải thiện thái độ.",
                },
            ],
        },
    ];

    return (
        <div>
            <h2>Danh sách thợ</h2>
            {repairmen.map((repairman) => (
                <div key={repairman.id} style={{ marginBottom: "1rem" }}>
                    <button onClick={() => handleOpenModal(repairman)}>
                        Xem thông tin: {repairman.fullName}
                    </button>
                </div>
            ))}

            <RepairmanInforModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onBook={handleBookRepairman}
                repairman={selectedRepairman}
            />
        </div>
    );
};

export default TestRepairmanInforModal;